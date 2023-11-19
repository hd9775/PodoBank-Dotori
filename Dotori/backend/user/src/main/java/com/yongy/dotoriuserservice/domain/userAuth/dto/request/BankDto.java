package com.yongy.dotoriuserservice.domain.userAuth.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BankDto {
    private Long bankSeq;
    private String bankName;
    private String bankUrl;
    private String bankId;
    private String bankPwd;
    private String serviceCode;

    @Builder
    public BankDto(Long bankSeq, String bankName, String bankUrl, String bankId, String bankPwd, String serviceCode) {
        this.bankSeq = bankSeq;
        this.bankName = bankName;
        this.bankUrl = bankUrl;
        this.bankId = bankId;
        this.bankPwd = bankPwd;
        this.serviceCode = serviceCode;
    }
}
