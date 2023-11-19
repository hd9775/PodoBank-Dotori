package com.yongy.dotoriuserservice.global.security.exception;

import lombok.Getter;

@Getter
public enum ErrorType {
    NOT_FOUND_USER(400, "사용자가 존재하지 않습니다.");

    int code;
    String message;

    ErrorType(int code , String message){
        this.code = code;
        this.message = message;
    }
}
