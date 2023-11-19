package com.yongy.dotoriuserservice.domain.user.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserLoginReqDto {
    private String id;
    private String password;


    public UserLoginReqDto(String id, String password) {
        this.id = id;
        this.password = password;
    }
}
