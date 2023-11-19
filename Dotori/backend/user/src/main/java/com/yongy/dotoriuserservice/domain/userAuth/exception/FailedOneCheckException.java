package com.yongy.dotoriuserservice.domain.userAuth.exception;

public class FailedOneCheckException extends RuntimeException{
    public FailedOneCheckException(String message){
        super(message);
    }
}
