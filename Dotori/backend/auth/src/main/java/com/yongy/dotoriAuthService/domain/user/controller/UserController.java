package com.yongy.dotoriAuthService.domain.user.controller;


import com.yongy.dotoriAuthService.domain.user.dto.request.UserEmailReqDto;
import com.yongy.dotoriAuthService.domain.user.dto.request.UserInfoReqDto;
import com.yongy.dotoriAuthService.domain.user.dto.request.UserLoginReqDto;
import com.yongy.dotoriAuthService.domain.user.dto.request.UserRefreshTokenDto;
import com.yongy.dotoriAuthService.domain.user.entity.Provider;
import com.yongy.dotoriAuthService.domain.user.entity.Role;
import com.yongy.dotoriAuthService.domain.user.entity.User;
import com.yongy.dotoriAuthService.domain.user.exception.*;
import com.yongy.dotoriAuthService.domain.user.service.UserService;
import com.yongy.dotoriAuthService.global.common.CallServer;
import com.yongy.dotoriAuthService.global.redis.entity.EmailAuth;
import com.yongy.dotoriAuthService.global.redis.entity.UserRefreshToken;
import com.yongy.dotoriAuthService.global.security.dto.JwtToken;
import com.yongy.dotoriAuthService.global.security.provider.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name= "users", description = "사용자 API")
@RequestMapping("/api/v1/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${dotori.main.url}")
    private String MAIN_SERVICE_URL;

    private final CallServer callServer;

    private final HashMap<String, Object> bodyData;
    private ResponseEntity<String> response;

    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "이메일 인증코드 전송"),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 사용자입니다.")
    })
    @Operation(summary= "회원가입의 이메일 인증", description = "ALL")
    @PostMapping("/email/check-id")
    public ResponseEntity<Void> validIdCheck(@RequestParam(name="id") String id){
        User user = userService.getUser(id);
        if(user == null){
            userService.emailCertification(id);
            return ResponseEntity.ok().build();
        }
        throw new AlreadyExistIdException("이미 존재하는 사용자입니다.");
    }

    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "이메일 인증 완료"),
            @ApiResponse(responseCode = "404", description = "인증번호가 만료되었습니다."),
            @ApiResponse(responseCode = "409", description = "인증번호가 올바르지 않습니다."),
    })
    @Operation(summary = "회원가입의 이메일 인증코드 확인", description = "ALL")
    @PostMapping("/email/check-code")
    public ResponseEntity<Void> validEmailCodeCheck(@RequestBody UserEmailReqDto userEmailReqDto){

        EmailAuth emailAuth = userService.getEmailAuth(userEmailReqDto.getCode());

        if(emailAuth == null) {
            throw new ExpiredAuthCodeException("인증번호가 만료되었습니다.");
        }else if(emailAuth.getEmail().equals(userEmailReqDto.getId())){
            userService.deleteEmailAuth(userEmailReqDto.getId());
            return ResponseEntity.ok().build();
        }else{
            throw new InvalidAuthCodeException("인증번호가 올바르지 않습니다.");
        }
    }

    @ApiResponses(value= {
            @ApiResponse(responseCode = "200", description = "회원가입을 완료했습니다."),
            @ApiResponse(responseCode = "400", description = "회원가입에 실패했습니다."),
    })
    @Operation(summary = "사용자 회원가입", description = "ALL")
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody UserInfoReqDto userInfoReqDto){

        try{
            User user = userService.userSingup(userInfoReqDto); // 사용자 회원가입

            // NOTE : 리워드 생성하기
            bodyData.clear();
            bodyData.put("userSeq", user.getUserSeq());

            response = callServer.getHttpWithParamsAndSend(MAIN_SERVICE_URL+"/reward/communication/enroll", HttpMethod.GET, bodyData);

            log.info("리워드 결과 : "+ response.getStatusCode());

            return ResponseEntity.ok().build();
        }catch(Exception e){
            throw new FailedSignupException("회원가입에 실패했습니다.");
        }
    }

    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "404", description = "아이디를 확인해주세요."),
            @ApiResponse(responseCode = "404", description = "비밀번호를 확인해주세요.")
    })
    @Operation(summary = "도토리 로그인", description = "ALL")
    @PostMapping("/signin")
    public ResponseEntity<JwtToken> dotoriLogin(@RequestBody UserLoginReqDto userLoginReqDto) {

        User user = userService.getUser(userLoginReqDto.getId());

        // NOTE : 아이디 확인
        if(user == null){
            throw new InvalidIdException("아이디를 확인해주세요.");
        }

        // NOTE : 비밀번호 확인
        if(user.getAuthProvider().equals(Provider.DOTORI)){
            if(!passwordEncoder.matches(userLoginReqDto.getPassword(), user.getPassword())){
                throw new InvalidPwdException("비밀번호를 확인해주세요.");
            }
        }

        JwtToken jwtToken = jwtTokenProvider.createToken(user.getId(), Role.ROLE_USER);

        // refreshToken 저장
        userService.saveUserRefreshToken(UserRefreshToken.of(userLoginReqDto.getId(), jwtToken.getRefreshToken()));

        // accessToken, refreshToken 전달
        return ResponseEntity.ok().body(jwtToken);
    }

    // NOTE : RefreshToken이 유효하면 accessToken, refreshToken을 재발급
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(responseCode = "404", description = "다시 로그인 해주세요.")
    })
    @Operation(summary = "새로운 토큰 발급", description = "ALL")
    @PostMapping("/new-token")
    public ResponseEntity<JwtToken> generateNewToken(@RequestBody UserRefreshTokenDto userRefreshTokenDto){

        // refreshToken이 유효한 경우
        if(userService.getUserRefreshToken(userRefreshTokenDto.getRefreshToken()) != null){

            String id = jwtTokenProvider.getUserIdFromToken(userRefreshTokenDto.getRefreshToken());

            JwtToken jwtToken = jwtTokenProvider.createToken(id , Role.ROLE_USER);

            // refreshToken 저장하기
            userService.saveUserRefreshToken(UserRefreshToken.of(id, jwtToken.getRefreshToken()));

            return ResponseEntity.ok().body(jwtToken);
        }

        throw new ExpiredAuthCodeException("다시 로그인 해주세요.");
    }


}


