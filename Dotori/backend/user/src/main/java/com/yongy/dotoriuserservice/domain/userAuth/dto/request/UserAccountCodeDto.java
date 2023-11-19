package com.yongy.dotoriuserservice.domain.userAuth.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserAccountCodeDto {
    private Long bankSeq;

    private String accountNumber;

    private String verificationCode;

    @Builder
    public UserAccountCodeDto(Long bankSeq, String accountNumber, String verificationCode) {
        this.bankSeq = bankSeq;
        this.accountNumber = accountNumber;
        this.verificationCode = verificationCode;
    }
}
