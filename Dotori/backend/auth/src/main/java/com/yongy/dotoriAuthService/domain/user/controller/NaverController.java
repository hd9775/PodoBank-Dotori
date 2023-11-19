package com.yongy.dotoriAuthService.domain.user.controller;

import com.yongy.dotoriAuthService.domain.user.entity.Provider;
import com.yongy.dotoriAuthService.domain.user.entity.User;
import com.yongy.dotoriAuthService.domain.user.exception.AlreadyExistIdException;
import com.yongy.dotoriAuthService.domain.user.exception.FailedSocialAuthException;
import com.yongy.dotoriAuthService.domain.user.service.NaverService;
import com.yongy.dotoriAuthService.domain.user.service.UserService;
import com.yongy.dotoriAuthService.global.common.CallServer;
import com.yongy.dotoriAuthService.global.redis.entity.UserRefreshToken;
import com.yongy.dotoriAuthService.global.security.dto.JwtToken;
import com.yongy.dotoriAuthService.global.security.provider.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth/naver")
public class NaverController {

    @Autowired
    private NaverService naverService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Value("${dotori.main.url}")
    private String MAIN_SERVICE_URL;

    private final CallServer callServer;

    private final HashMap<String, Object> bodyData;
    private ResponseEntity<String> response;

    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "네이버 회원가입 성공"),
            @ApiResponse(responseCode = "201", description = "네이버 로그인 성공"),
            @ApiResponse(responseCode = "403", description = "네이버 인증에 실패했습니다.")
    })
    @Operation(summary = "네이버 회원가입/로그인", description = "ALL")
    @GetMapping("/callback")
    public ResponseEntity<JwtToken> callback(HttpServletRequest request) throws Exception {
        String code = request.getParameter("code");
        log.info("-----------come--------");
        // NOTE : 인가코드 인증 실패
        if(code == null){
            throw new FailedSocialAuthException("네이버 인증에 실패했습니다.");
        }

        String accessToken = naverService.getAccessToken(code);

        // NOTE : AccessToken 인증 실패
        if(accessToken == null){
            throw new FailedSocialAuthException("네이버 인증에 실패했습니다.");
        }

        User user = naverService.getUserInfo(accessToken);

        // NOTE : 사용자 정보 가져오기 실패
        if(user == null){
            throw new FailedSocialAuthException("네이버 인증에 실패했습니다.");
        }else{
            // NOTE : 회원가입
            User userFromDB = userService.getUser(user.getId());
            if(userFromDB == null){
                user = userService.saveUser(user);  // DB에 사용자 저장

                // NOTE : 리워드 생성하기
                bodyData.clear();
                bodyData.put("userSeq", user.getUserSeq());

                response = callServer.getHttpWithParamsAndSend(MAIN_SERVICE_URL+"/reward/communication/enroll", HttpMethod.GET, bodyData);

                log.info("리워드 결과 : "+ response.getStatusCode());

                return ResponseEntity.ok().build();
            }

            // NOTE : 네이버 로그인
            if(userFromDB.getAuthProvider() == Provider.NAVER){
                JwtToken jwtToken = jwtTokenProvider.createToken(user.getId(), user.getRole());

                userService.saveUserRefreshToken(UserRefreshToken.of(user.getId(), jwtToken.getRefreshToken()));

                return ResponseEntity.ok().body(jwtToken);
            }

            // NOTE : 도토리 or 카카오로 회원가입이 되어있음
            throw new AlreadyExistIdException("다른 경로로 회원가입이 되어있습니다.");
        }
    }

}
