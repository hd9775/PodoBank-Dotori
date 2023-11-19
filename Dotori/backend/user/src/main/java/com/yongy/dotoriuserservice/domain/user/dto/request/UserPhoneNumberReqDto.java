package com.yongy.dotoriuserservice.domain.user.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserPhoneNumberReqDto {
    private String phoneNumber;
    public UserPhoneNumberReqDto(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
