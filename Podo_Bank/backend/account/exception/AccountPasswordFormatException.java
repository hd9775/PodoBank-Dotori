package com.bank.podo.domain.account.exception;

public class AccountPasswordFormatException extends RuntimeException {
    public AccountPasswordFormatException(String message) {
        super(message);
    }
}
