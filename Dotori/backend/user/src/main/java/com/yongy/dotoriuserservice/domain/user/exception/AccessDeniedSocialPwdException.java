package com.yongy.dotoriuserservice.domain.user.exception;

public class AccessDeniedSocialPwdException extends RuntimeException{
    public AccessDeniedSocialPwdException(String message){
        super(message);
    }
}
