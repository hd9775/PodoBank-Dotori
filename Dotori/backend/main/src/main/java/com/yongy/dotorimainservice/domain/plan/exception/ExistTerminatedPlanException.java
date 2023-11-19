package com.yongy.dotorimainservice.domain.plan.exception;

public class ExistTerminatedPlanException extends RuntimeException{
    public ExistTerminatedPlanException(String message){
        super(message);
    }
}
