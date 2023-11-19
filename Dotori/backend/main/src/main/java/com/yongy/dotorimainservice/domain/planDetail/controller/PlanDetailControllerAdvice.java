package com.yongy.dotorimainservice.domain.planDetail.controller;

import com.yongy.dotorimainservice.domain.planDetail.exception.NotFoundPlanDetailException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PlanDetailControllerAdvice {
    @ExceptionHandler
    public ResponseEntity<?> HandlerNotFoundPlanDetailException(NotFoundPlanDetailException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
}
