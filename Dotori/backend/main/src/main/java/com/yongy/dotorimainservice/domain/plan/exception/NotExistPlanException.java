package com.yongy.dotorimainservice.domain.plan.exception;

public class NotExistPlanException extends RuntimeException{
    public NotExistPlanException(String message){
        super(message);
    }
}
