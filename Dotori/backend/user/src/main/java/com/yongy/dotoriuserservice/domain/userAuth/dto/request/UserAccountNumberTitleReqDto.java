package com.yongy.dotoriuserservice.domain.userAuth.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserAccountNumberTitleReqDto {
    private String accountNumber;
    private String accountTitle;

    @Builder
    public UserAccountNumberTitleReqDto(String accountNumber, String accountTitle) {
        this.accountNumber = accountNumber;
        this.accountTitle = accountTitle;
    }
}
