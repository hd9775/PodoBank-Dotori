package com.yongy.dotoriuserservice.domain.user.controller;

import com.yongy.dotoriuserservice.domain.user.dto.communication.UserDto;
import com.yongy.dotoriuserservice.domain.user.dto.communication.UserIdDto;
import com.yongy.dotoriuserservice.domain.user.dto.request.UserBirthDateReqDto;
import com.yongy.dotoriuserservice.domain.user.dto.request.UserPhoneNumberReqDto;
import com.yongy.dotoriuserservice.domain.user.dto.request.UserRefreshTokenDto;
import com.yongy.dotoriuserservice.domain.user.dto.request.UserUpdatePasswordReqDto;
import com.yongy.dotoriuserservice.domain.user.dto.response.UserInfoResDto;
import com.yongy.dotoriuserservice.domain.user.entity.Provider;
import com.yongy.dotoriuserservice.domain.user.entity.Role;
import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.user.exception.AccessDeniedSocialPwdException;
import com.yongy.dotoriuserservice.domain.user.exception.ExpiredAuthCodeException;
import com.yongy.dotoriuserservice.domain.user.exception.FailedRetiredException;
import com.yongy.dotoriuserservice.domain.user.exception.InvalidPwdException;
import com.yongy.dotoriuserservice.domain.user.service.UserService;
import com.yongy.dotoriuserservice.domain.user.service.UserServiceImpl;
import com.yongy.dotoriuserservice.global.common.CallServer;

import com.yongy.dotoriuserservice.global.security.provider.AuthProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.web.bind.annotation.*;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name= "users", description = "사용자 API")
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${dotori.purpose.url}")
    private String PURPOSE_SERVICE_URL;

    @Value("${dotori.main.url}")
    private String MAIN_SERVICE_URL;

    @Autowired
    private CallServer callServer;

    private final HashMap<String, Object> bodyData;
    private ResponseEntity<String> response;


    // NOTE : 사용자 데이터 가져오기
    @ApiResponse(responseCode = "200", description = "사용자의 데이터를 가져오는데 성공함")
    @Operation(summary = "사용자 데이터 가져오기", description = "USER")
    @GetMapping()
    public ResponseEntity<UserInfoResDto> getUserInfo(){

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ResponseEntity.ok().body(UserInfoResDto.builder()
                .userSeq(user.getUserSeq())
                .id(user.getId())
                .birthDate(user.getBirthDate())
                .userName(user.getUserName())
                .phoneNumber(user.getPhoneNumber())
                .authProvider(user.getAuthProvider()).build());
    }


    // NOTE : 생년월일 수정
    @ApiResponse(responseCode = "200", description = "사용자의 생년월일 업데이트 완료")
    @Operation(summary = "사용자의 생년월일 업데이트", description = "USER")
    @PatchMapping("/birthDate")
    public ResponseEntity<Void>updateBirthDate(@RequestBody UserBirthDateReqDto userBirthDateReqDto){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setBirthDate(LocalDate.parse(userBirthDateReqDto.getBirthDate()));
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }


    // NOTE : 핸드폰번호 수정
    @ApiResponse(responseCode = "200", description = "사용자의 헨드폰번호 업데이트 완료")
    @Operation(summary = "사용자의 헨드폰번호 업데이트", description = "USER")
    @PatchMapping("/phoneNumber")
    public ResponseEntity<?>updatePhoneNumber(@RequestBody UserPhoneNumberReqDto userPhoneNumberReqDto){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setPhoneNumber(userPhoneNumberReqDto.getPhoneNumber());
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    // NOTE : 비밀번호 변경
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "사용자 비밀번호 변경 완료"),
            @ApiResponse(responseCode = "403", description = "네이버, 카카오 로그인은 비밀번호를 변경할 수 없습니다."),
            @ApiResponse(responseCode = "404", description = "비밀번호를 확인해주세요.")
    })
    @Operation(summary = "사용자의 비밀번호 업데이트", description = "USER")
    @PatchMapping("/password")
    public ResponseEntity<?>updatePassword(@RequestBody UserUpdatePasswordReqDto userUpdatePasswordReqDto){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!user.getAuthProvider().equals(Provider.DOTORI))
            throw new AccessDeniedSocialPwdException("네이버, 카카오 로그인은 비밀번호를 변경할 수 없습니다.");


        if(passwordEncoder.matches(userUpdatePasswordReqDto.getBeforePassword(), user.getPassword())){
            user.setPassword(passwordEncoder.encode(userUpdatePasswordReqDto.getAfterPassword()));
            userService.saveUser(user);
            return ResponseEntity.ok().build();
        }

        throw new InvalidPwdException("비밀번호를 확인해주세요.");
    }

    // NOTE : 로그아웃
    @ApiResponse(responseCode = "200", description = "사용자 로그아웃 완료")
    @Operation(summary = "사용자 로그아웃", description = "USER")
    @PatchMapping("/logout")
    public ResponseEntity<String>logout(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.deleteUserRefreshToken(user.getId());
        return ResponseEntity.ok().build();
    }

    // NOTE : 탈퇴하기
    @ApiResponse(responseCode = "200", description = "사용자 탈퇴 완료")
    @Operation(summary = "사용자 탈퇴하기", description = "USER")
    @PatchMapping("/retire")
    public ResponseEntity<String>retire(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // NOTE : 사용자의 통장에 돈이 있으면 탈퇴할 수 없음
        // TODO : dotori-purpose-service와 통신
        bodyData.clear();
        bodyData.put("userSeq", user.getUserSeq());

        BigDecimal currentMoney = new BigDecimal(
                callServer.postHttpBodyAndSend(PURPOSE_SERVICE_URL+"/purpose/communication", bodyData).getBody()
        );

        if(currentMoney.compareTo(BigDecimal.ZERO) != 0){
            throw new FailedRetiredException("사용자의 목표 통장에 돈이 남아있어서 탈퇴할 수 없습니다.");
        }

        // NOTE : 사용자의 진행중인 계획 모두 삭제하기
        response = callServer.postHttpBodyAndSend(MAIN_SERVICE_URL+"/plan/communication/delete/all", bodyData);

        // NOTE : 사용자의 계좌 모두 삭제하기
        response = callServer.postHttpBodyAndSend(MAIN_SERVICE_URL+"/account/communication/delete/all", bodyData);

        // NOTE : 사용자의 RefreshToken 삭제하기
        userService.deleteUserRefreshToken(user.getId());

        // NOTE : 사용자의 Reward 삭제하기
        bodyData.clear();
        bodyData.put("userSeq", user.getUserSeq());

        response = callServer.getHttpWithParamsAndSend(MAIN_SERVICE_URL+"/reward/communication/delete", HttpMethod.GET, bodyData);

        log.info("리워드 삭제 결과 : "+ response.getStatusCode());


        // NOTE : 사용자 탈퇴하기
        userService.removeRetireUser(user);

        return ResponseEntity.ok().build();
    }



    // ------------통신--------------
    @ApiResponse(responseCode = "200", description = "사용자의 데이터를 가져오는데 성공함")
    @Operation(summary = "[통신] 사용자 데이터 가져오기", description = "USER")
    @PostMapping("/communication/userById")
    public ResponseEntity<User> getUserById(@RequestBody UserIdDto userIdDto){
        return ResponseEntity.ok(userService.getUserById(userIdDto.getId()));
    }



}
