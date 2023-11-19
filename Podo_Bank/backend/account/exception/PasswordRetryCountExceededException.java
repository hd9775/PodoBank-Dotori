package com.bank.podo.domain.account.exception;

public class PasswordRetryCountExceededException extends RuntimeException {
    public PasswordRetryCountExceededException(String message, int retryCount) {
        super(message + " 3회 실패시 계좌가 잠김니다. (현재: " + retryCount + "회)");
    }
}
