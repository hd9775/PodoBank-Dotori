package com.yongy.dotoriuserservice.domain.userAuth.exception;

public class ExistAccountNumberException extends RuntimeException{
    public ExistAccountNumberException(String message){
        super(message);
    }
}
