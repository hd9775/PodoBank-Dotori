package com.yongy.dotoriuserservice.global.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorMessage {

    private String message;

    public static final ErrorMessage WRONG_TYPE_TOKEN = new ErrorMessage("잘못된 유형의 토큰입니다.");
    public static final ErrorMessage UNSUPPORTED_TOKEN = new ErrorMessage("지원하지 않는 토큰입니다.");
    public static final ErrorMessage EXPIRED_TOKEN = new ErrorMessage("토큰이 만료되었습니다.");
    public static final ErrorMessage UNKNOWN_ERROR = new ErrorMessage("알 수 없는 오류가 발생했습니다.");
}