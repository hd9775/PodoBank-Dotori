package com.bank.podo.domain.openbank.controller;

import com.bank.podo.domain.openbank.exception.AlreadyExistUserException;
import com.bank.podo.domain.openbank.exception.FintechServiceNotFoundException;
import com.bank.podo.domain.openbank.exception.VerificationCodeNotMathchException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class OpenBankingControllerAdvice {

    @ExceptionHandler
    public ResponseEntity<String> handleFintechServiceNotFoundException(FintechServiceNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleVerificationCodeNotMathchException(VerificationCodeNotMathchException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleAlreadyExistUserException(AlreadyExistUserException e) {
        return ResponseEntity.status(409).body(e.getMessage());
    }

}
