package com.bank.podo.domain.user.controller;

import com.bank.podo.domain.user.exception.AlreadyUsedUsernameException;
import com.bank.podo.domain.user.exception.FromatException;
import com.bank.podo.domain.user.exception.PasswordNotMatchException;
import com.bank.podo.domain.user.exception.UserNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserControllerAdvice {

    @ExceptionHandler
    public ResponseEntity<String> handleAlreadyUsedUsernameException(AlreadyUsedUsernameException e) {
        return ResponseEntity.status(409).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleFromatException(FromatException e) {
        return ResponseEntity.status(422).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handlerUserNotFoundException(UserNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<String> handlePasswordNotMatchException(PasswordNotMatchException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
