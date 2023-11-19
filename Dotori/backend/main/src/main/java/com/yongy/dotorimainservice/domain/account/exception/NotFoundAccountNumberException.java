package com.yongy.dotorimainservice.domain.account.exception;

public class NotFoundAccountNumberException extends RuntimeException{
    public NotFoundAccountNumberException(String message) {
        super(message);
    }
}
