package com.yongy.dotorimainservice.domain.reward.controller;

import com.yongy.dotorimainservice.domain.reward.exception.NotfoundRewardException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RewardControllerAdvice {
    @ExceptionHandler
    public ResponseEntity<?> handleNotfoundRewardException(NotfoundRewardException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
}
