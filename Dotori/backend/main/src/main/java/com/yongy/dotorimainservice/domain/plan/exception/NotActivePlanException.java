package com.yongy.dotorimainservice.domain.plan.exception;

public class NotActivePlanException extends RuntimeException{
    public NotActivePlanException(String message){
        super(message);
    }
}
