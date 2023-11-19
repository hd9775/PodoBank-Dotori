package com.yongy.dotoripurposeservice.domain.purpose.exception;

public class FailedWithdrawException extends RuntimeException{
    public FailedWithdrawException(String message){
        super(message);
    }
}
