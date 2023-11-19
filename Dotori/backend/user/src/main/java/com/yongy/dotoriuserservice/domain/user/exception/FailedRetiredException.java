package com.yongy.dotoriuserservice.domain.user.exception;

public class FailedRetiredException extends RuntimeException{
    public FailedRetiredException(String message){
        super(message);
    }
}
