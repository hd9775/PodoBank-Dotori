package com.bank.podo.domain.openbank.exception;

public class FintechServiceNotFoundException extends RuntimeException {
    public FintechServiceNotFoundException(String message) {
        super(message);
    }
}
