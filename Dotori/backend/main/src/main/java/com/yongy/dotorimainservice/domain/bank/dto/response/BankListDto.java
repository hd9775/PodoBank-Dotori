package com.yongy.dotorimainservice.domain.bank.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankListDto {
    private Long bankSeq;

    private String bankName;

    @Builder
    public BankListDto(Long bankSeq, String bankName) {
        this.bankSeq = bankSeq;
        this.bankName = bankName;
    }

}
