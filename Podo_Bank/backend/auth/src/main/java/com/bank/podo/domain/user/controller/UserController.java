package com.bank.podo.domain.user.controller;

import com.bank.podo.domain.user.dto.*;
import com.bank.podo.domain.user.service.UserService;
import com.bank.podo.global.email.dto.EmailVerificationCheckDTO;
import com.bank.podo.global.email.dto.EmailVerificationDTO;
import com.bank.podo.global.email.dto.EmailVerificationSuccessDTO;
import com.bank.podo.global.email.service.EmailService;
import com.bank.podo.global.security.entity.Token;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "회원가입")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "회원가입 실패"),
            @ApiResponse(responseCode = "409", description = "이미 사용중인 아이디"),
            @ApiResponse(responseCode = "422", description = "이메일 형식 오류")
    })
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterDTO registerDTO) {
        userService.register(registerDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이메일 인증 코드 전송")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 전송 성공"),
            @ApiResponse(responseCode = "400", description = "이메일 전송 실패"),
            @ApiResponse(responseCode = "422", description = "이메일 형식 오류"),
            @ApiResponse(responseCode = "429", description = "재전송 대기시간")
    })
    @PostMapping("/emailVerification")
    public ResponseEntity<Void> sendVerificationCode(@RequestBody EmailVerificationDTO emailVerificationDTO) {
        userService.checkEmailFormat(emailVerificationDTO.getEmail());

        emailService.sendVerificationCode(emailVerificationDTO.getEmail(), emailVerificationDTO.getType());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이메일 인증 코드 확인")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 일치"),
            @ApiResponse(responseCode = "400", description = "인증 실패")
    })
    @PostMapping("/emailVerification/check")
    public ResponseEntity<EmailVerificationSuccessDTO> checkVerificationCode(@RequestBody EmailVerificationCheckDTO emailVerificationCheckDTO) {
        EmailVerificationSuccessDTO successCode = emailService.checkVerificationCode(emailVerificationCheckDTO.getEmail(), emailVerificationCheckDTO.getCode(), emailVerificationCheckDTO.getType());

        return ResponseEntity.ok(successCode);
    }

    @Operation(summary = "아이디 중복 체크")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 사용 가능"),
            @ApiResponse(responseCode = "409", description = "이메일 중복"),
            @ApiResponse(responseCode = "422", description = "이메일 형식 오류")
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<Void> checkUsername(@PathVariable String email) {
        userService.checkUsername(email);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "로그인")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "로그인 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        return userService.login(request, loginDTO, passwordEncoder);
    }

    @Operation(summary = "토큰 재발급")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(responseCode = "400", description = "토큰 재발급 실패")
    })
    @PostMapping("/refresh")
    public ResponseEntity<Token> refresh(@RequestParam String refreshToken, HttpServletRequest request) {
        return userService.refresh(refreshToken, request);
    }

    @Operation(summary = "리프레시 토큰 삭제", hidden = true)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리프레시 토큰 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "리프레시 토큰 삭제 실패")
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> deleteRefreshToken(@RequestBody String email) {
        userService.deleteRefreshToken(email);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "인증 성공 확인", hidden = true)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 성공"),
            @ApiResponse(responseCode = "400", description = "인증 실패")
    })
    @PostMapping("/checkSuccessCode")
    public ResponseEntity<Void> checkSuccessCode(@RequestBody CheckSuccessCodeDTO checkSuccessCodeDTO) {
        boolean success = emailService.checkSuccessCode(checkSuccessCodeDTO.getEmail(),
                checkSuccessCodeDTO.getSuccessCode(), checkSuccessCodeDTO.getVerificationType());

        if(success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
