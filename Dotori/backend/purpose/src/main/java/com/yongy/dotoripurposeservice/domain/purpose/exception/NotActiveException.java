package com.yongy.dotoripurposeservice.domain.purpose.exception;

public class NotActiveException extends RuntimeException{
    public NotActiveException(String message){
        super(message);
    }
}
