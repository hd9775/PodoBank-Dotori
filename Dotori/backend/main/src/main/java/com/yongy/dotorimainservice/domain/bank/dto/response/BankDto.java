package com.yongy.dotorimainservice.domain.bank.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BankDto {
    private String bankName;
    private String bankUrl;
    private String bankId;
    private String bankPwd;
    private String serviceCode;

    @Builder
    public BankDto(String bankName, String bankUrl, String bankId, String bankPwd, String serviceCode) {
        this.bankName = bankName;
        this.bankUrl = bankUrl;
        this.bankId = bankId;
        this.bankPwd = bankPwd;
        this.serviceCode = serviceCode;
    }
}
