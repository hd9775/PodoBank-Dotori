package com.yongy.dotorimainservice.domain.account.exception;

public class ExistAccountNumberException extends RuntimeException{
    public ExistAccountNumberException(String message){
        super(message);
    }
}
