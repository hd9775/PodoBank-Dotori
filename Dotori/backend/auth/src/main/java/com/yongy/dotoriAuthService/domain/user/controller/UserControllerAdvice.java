package com.yongy.dotoriAuthService.domain.user.controller;


import com.yongy.dotoriAuthService.domain.user.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class UserControllerAdvice {


    // NOTE : 이미 존재하는 사용자입니다.
    @ExceptionHandler
    public ResponseEntity<?> handleAlreadyExistIdException(AlreadyExistIdException e){
        return ResponseEntity.status(409).body(e.getMessage());
    }

    // NOTE : 인증번호가 만료되었습니다, 다시 로그인 해주세요.
    @ExceptionHandler
    public ResponseEntity<?> handleExpiredAuthCodeException(ExpiredAuthCodeException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    // NOTE : 인증번호가 올바르지 않습니다.
    @ExceptionHandler
    public ResponseEntity<?> handleInvalidAuthCodeException(InvalidAuthCodeException e){
        return ResponseEntity.status(409).body(e.getMessage());
    }

    // NOTE : 회원가입에 실패했습니다.
    @ExceptionHandler
    public ResponseEntity<?> handleFailedSignupException(FailedSignupException e){
        return ResponseEntity.status(400).body(e.getMessage());
    }

    // NOTE : 아이디를 확인해주세요
    @ExceptionHandler
    public ResponseEntity<?> handleInvalidIdException(InvalidIdException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    // NOTE : 비밀번호를 확인해주세요
    @ExceptionHandler
    public ResponseEntity<?> handleInvalidPwdException(InvalidPwdException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    // NOTE : 네이버 인증에 실패했습니다, 카카오 인증에 실패했습니다.
    @ExceptionHandler
    public ResponseEntity<?> handleFailedSocialAuthException(FailedSocialAuthException e){
        return ResponseEntity.status(403).body(e.getMessage());
    }


}
