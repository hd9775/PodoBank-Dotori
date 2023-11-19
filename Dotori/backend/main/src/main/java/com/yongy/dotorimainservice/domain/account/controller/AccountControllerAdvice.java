package com.yongy.dotorimainservice.domain.account.controller;


import com.yongy.dotorimainservice.domain.account.exception.ExistAccountNumberException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AccountControllerAdvice {

    @ExceptionHandler
    public ResponseEntity<?> handleExistAccountNumberException(ExistAccountNumberException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
    

}
