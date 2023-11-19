package com.yongy.dotoriuserservice.domain.userAuth.controller;

import com.yongy.dotoriuserservice.domain.userAuth.exception.ExistAccountNumberException;
import com.yongy.dotoriuserservice.domain.user.dto.request.UserEmailReqDto;
import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.user.exception.ExpiredAuthCodeException;
import com.yongy.dotoriuserservice.domain.user.exception.InvalidAuthCodeException;
import com.yongy.dotoriuserservice.domain.user.exception.InvalidIdException;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountCodeDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountNumberTitleReqDto;
import com.yongy.dotoriuserservice.domain.userAuth.exception.FailedOneReqException;
import com.yongy.dotoriuserservice.domain.userAuth.service.UserAuthService;
import com.yongy.dotoriuserservice.domain.userAuth.service.UserAuthServiceImpl;
import com.yongy.dotoriuserservice.global.common.CallServer;
import com.yongy.dotoriuserservice.global.redis.entity.PersonalAuth;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/oneCent")
public class UserAuthController {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private CallServer callServer;

    private final HashMap<String, Object> bodyData;

    private ResponseEntity<String> response;

    @Value("${dotori.purpose.url}")
    private String PURPOSE_SERVICE_URL;

    @Value("${dotori.main.url}")
    private String MAIN_SERVICE_URL;


    @ApiResponse(responseCode = "404", description = "사용자의 정보의 이메일과 정보가 일치하지 않습니다.")
    @Operation(summary = "[1원 인증의 본인인증] 사용자 이메일에 인증번호 보내기", description = "USER")
    @PostMapping("/own/check-id")
    public ResponseEntity<Void> sendMsgAuthCode(@RequestParam String id){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User)auth.getPrincipal();
        if(authUser.getId().equals(id)){
            userAuthService.emailCertification(id);
            return ResponseEntity.ok().build();
        }
        throw new InvalidIdException("사용자의 정보의 이메일과 정보가 일치하지 않습니다.");
    }

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "1원인증 완료"),
            @ApiResponse(responseCode = "404", description = "인증번호가 만료되었습니다."),
            @ApiResponse(responseCode = "409", description = "인증번호가 올바르지 않습니다.")
    })
    @Operation(summary = "[1원 인증의 본인인증] 인증코드 확인하기", description = "USER")
    @PostMapping("/own/check-code")
    public ResponseEntity<Void>validSmsCodeCheck(@RequestBody UserEmailReqDto userEmailReqDto){

        PersonalAuth personalAuth = userAuthService.getPersonalAuth(userEmailReqDto.getCode());

        if(personalAuth.getEmail() == null) {
            throw new ExpiredAuthCodeException("인증번호가 만료되었습니다.");
        }else if(personalAuth.getEmail().equals(userEmailReqDto.getId())){
            userAuthService.deletePersonalAuth(personalAuth.getEmail()); // 인증번호 삭제
            return ResponseEntity.ok().build();
        }else{
            throw new InvalidAuthCodeException("인증번호가 올바르지 않습니다.");
        }
    }


    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포도은행에 1원 인증 성공"),
            @ApiResponse(responseCode = "404", description = "포도은행에 1원 인증 실패")
    })
    @Operation(summary = "[포도은행에서 1원 인증] 포도은행에서 계좌의 존재 여부 확인한 후 1원 인증 요청하기", description = "USER")
    @PostMapping("/podoBank/check-account")
    public ResponseEntity<Void> sendAccountAuthCode(@RequestBody UserAccountDto userAccountDto) throws ParseException {
        bodyData.clear();
        bodyData.put("accountNumber", userAccountDto.getAccountNumber());

        log.info("--1원인증 들어옴--");

        response = callServer.postHttpBodyAndSend(MAIN_SERVICE_URL+"/account/communication", bodyData);

        if(response.getBody().toString().equals("YES")){
            throw new ExistAccountNumberException("이미 연결된 계좌입니다.");
        }

        String responseCode = userAuthService.sendAccountAuthCode(userAccountDto);
        log.info(responseCode);
        if(responseCode.equals("200"))
            return ResponseEntity.ok().build();
        throw new FailedOneReqException("포도은행에 1원 인증 실패");
    }


    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 일치"),
            @ApiResponse(responseCode = "404", description = "1원 인증 실패")
    })
    @Operation(summary = "[포도은행에서 1원 인증] 포도은행에 1원 인증코드 검사하기", description = "USER")
    @PostMapping("/podoBank/check-code")
    public ResponseEntity<Void> checkAccountAuthCode(@RequestBody UserAccountCodeDto userAccountCodeDto) throws ParseException {
        return userAuthService.checkAccountAuthCode(userAccountCodeDto);
    }


    @ApiResponse(responseCode = "200", description = "계좌이름 설정 완료")
    @Operation(summary = "계좌의 이름 설정하기", description = "USER")
    @PostMapping("/account/title")
    public ResponseEntity<Void> setAccountName(@RequestBody UserAccountNumberTitleReqDto userAccountNumberTitleReqDto){
        bodyData.clear();
        bodyData.put("accountNumber", userAccountNumberTitleReqDto.getAccountNumber());
        bodyData.put("accountTitle", userAccountNumberTitleReqDto.getAccountTitle());

        response = callServer.postHttpBodyAndSend(MAIN_SERVICE_URL+"/account/communication/setTitle", bodyData);

        return ResponseEntity.ok().build();
    }


}
