package com.yongy.dotoriuserservice.domain.userAuth.exception;

public class FailedOneReqException extends RuntimeException{
    public FailedOneReqException(String message){
        super(message);
    }
}
