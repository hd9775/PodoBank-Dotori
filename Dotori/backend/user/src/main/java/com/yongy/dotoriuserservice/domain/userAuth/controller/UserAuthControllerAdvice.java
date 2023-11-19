package com.yongy.dotoriuserservice.domain.userAuth.controller;

import com.yongy.dotoriuserservice.domain.userAuth.exception.FailedOneCheckException;
import com.yongy.dotoriuserservice.domain.userAuth.exception.FailedOneReqException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserAuthControllerAdvice {
// 400 Bad Request : 잘못된 문법으로 인하여 서버가 요청을 이해할 수 없음
// 401 Unauthorized : 클라이언트는 요청한 응답을 받기 위해 스스로 인증해야 한다.(비승인)
// 403 Forbidden : 클라이언트가 접근할 권리를 가지고 있지 않다.(미승인) => 401과 다른 점은 서버가 클라이언트가 누군지 알고 있다.
// 404 Not Found : 서버는 요청받은 리소스를 찾을 수 없다.(API에서 종점은 적절하지만 리소스 자체가 존재하지 않음을 의미한다)
// 409 Conflict : 요청이 현재 서버의 상태와 충돌될 때 보낸다.

    // NOTE : 1원 인증 요청 실패
    @ExceptionHandler
    public ResponseEntity<?> handleFailedOneReqException(FailedOneReqException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }


    // NOTE : 1원 인증 검증 실패
    @ExceptionHandler
    public ResponseEntity<?> handleFailedOneCheckException(FailedOneCheckException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<?> handleIllegalAccessException(IllegalArgumentException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

}
