package com.yongy.dotoripurposeservice.domain.purpose.dto.communication;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class BankDTO {
    private Long bankSeq;
    private String bankName;
    private String bankUrl;
    private String bankId;
    private String bankPwd;
    private String serviceCode;


    @Builder
    public BankDTO(Long bankSeq, String bankName, String bankUrl, String bankId, String bankPwd, String serviceCode) {
        this.bankSeq = bankSeq;
        this.bankName = bankName;
        this.bankUrl = bankUrl;
        this.bankId = bankId;
        this.bankPwd = bankPwd;
        this.serviceCode = serviceCode;
    }
}
