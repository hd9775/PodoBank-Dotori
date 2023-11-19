package com.yongy.dotoriuserservice.domain.user.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserBirthDateReqDto {
    private String birthDate;

    public UserBirthDateReqDto(String birthDate) {
        this.birthDate = birthDate;
    }
}
