package com.yongy.dotorimainservice.domain.plan.exception;

public class PaymentUpdateBeforeException extends RuntimeException{
    public PaymentUpdateBeforeException(String message){
        super(message);
    }
}
