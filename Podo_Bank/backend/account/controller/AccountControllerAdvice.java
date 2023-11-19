package com.bank.podo.domain.account.controller;

import com.bank.podo.domain.account.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class AccountControllerAdvice {

    @ExceptionHandler(PasswordRetryCountExceededException.class)
    public ResponseEntity<String> handlePasswordRetryCountExceededException(PasswordRetryCountExceededException e) {
        log.info("PasswordRetryCountExceededException: {}", e.getMessage());
        return ResponseEntity.status(429).body(e.getMessage());
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<String> handleAccountNotFoundException(AccountNotFoundException e) {
        log.info("AccountNotFoundException: {}", e.getMessage());
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler(AccountPasswordFormatException.class)
    public ResponseEntity<String> handleAccountPasswordFormatException(AccountPasswordFormatException e) {
        log.info("AccountPasswordFormatException: {}", e.getMessage());
        return ResponseEntity.status(422).body(e.getMessage());
    }

    @ExceptionHandler(AccountUserNotMatchException.class)
    public ResponseEntity<String> handleAccountUserNotMatchException(AccountUserNotMatchException e) {
        log.info("AccountUserNotMatchException: {}", e.getMessage());
        return ResponseEntity.status(403).body(e.getMessage());
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<String> handleInsufficientBalanceException(InsufficientBalanceException e) {
        log.info("InsufficientBalanceException: {}", e.getMessage());
        return ResponseEntity.status(402).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleAccountLockedException(AccountLockedException e) {
        log.info("AccountLockedException: {}", e.getMessage());
        return ResponseEntity.status(423).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleAccountBalanceNotZeroException(AccountBalanceNotZeroException e) {
        log.info("AccountBalanceNotZeroException: {}", e.getMessage());
        return ResponseEntity.status(409).body(e.getMessage());
    }
}

