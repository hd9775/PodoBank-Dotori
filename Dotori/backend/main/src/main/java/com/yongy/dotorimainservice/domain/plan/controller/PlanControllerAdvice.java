package com.yongy.dotorimainservice.domain.plan.controller;


import com.yongy.dotorimainservice.domain.plan.exception.ExistTerminatedPlanException;
import com.yongy.dotorimainservice.domain.plan.exception.PaymentUpdateBeforeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class PlanControllerAdvice {

    @ExceptionHandler
    public ResponseEntity<?> HandlerPaymentUpdateBeforeException(PaymentUpdateBeforeException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<?> HandlerExistTerminatedPlanException(ExistTerminatedPlanException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
}
