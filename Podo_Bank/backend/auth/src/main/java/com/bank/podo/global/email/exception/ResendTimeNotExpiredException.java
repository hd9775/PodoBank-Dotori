package com.bank.podo.global.email.exception;

public class ResendTimeNotExpiredException extends RuntimeException {
    public ResendTimeNotExpiredException() {
        super("이미 인증코드를 전송했습니다. 1분 후에 다시 시도해주세요.");
    }
}
