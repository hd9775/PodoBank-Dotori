package com.bank.podo.domain.openbank.exception;

public class VerificationCodeNotMathchException extends RuntimeException {
    public VerificationCodeNotMathchException(String message) {
        super(message);
    }
}
