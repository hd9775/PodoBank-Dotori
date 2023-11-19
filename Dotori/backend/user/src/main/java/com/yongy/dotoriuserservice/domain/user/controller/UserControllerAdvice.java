package com.yongy.dotoriuserservice.domain.user.controller;


import com.yongy.dotoriuserservice.domain.user.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserControllerAdvice {

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

    // NOTE : 네이버, 카카오 로그인은 비밀번호를 변경할 수 없습니다.
    @ExceptionHandler
    public ResponseEntity<?> handleAccessDeniedSocialPwdException(AccessDeniedSocialPwdException e){
        return ResponseEntity.status(403).body(e.getMessage());
    }

    // NOTE : 탈퇴할 수 없습니다.
    @ExceptionHandler
    public ResponseEntity<?> handleFailedRetiredException(FailedRetiredException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }


}
