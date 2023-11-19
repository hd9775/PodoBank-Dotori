package com.yongy.dotoriuserservice.domain.user.dto.request;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserInfoReqDto {
    private String id;
    private String password;
    private String userName;
    private String birthDate;
    private String phoneNumber;

    public UserInfoReqDto(String id, String password, String userName, String birthDate, String phoneNumber) {
        this.id = id;
        this.password = password;
        this.userName = userName;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
    }
}
