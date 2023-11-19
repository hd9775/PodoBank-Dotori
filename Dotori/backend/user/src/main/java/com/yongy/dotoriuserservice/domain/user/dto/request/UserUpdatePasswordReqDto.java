package com.yongy.dotoriuserservice.domain.user.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserUpdatePasswordReqDto {
    private String beforePassword;
    private String afterPassword;

    public UserUpdatePasswordReqDto(String beforePassword, String afterPassword) {
        this.beforePassword = beforePassword;
        this.afterPassword = afterPassword;
    }
}
