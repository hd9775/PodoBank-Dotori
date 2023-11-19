package com.yongy.dotorimainservice.domain.account.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
public class AccountDto {
    private String bankName;
    private String accountNumber;
    private BigDecimal accountBalance;

    @Builder
    public AccountDto(String bankName, String accountNumber, BigDecimal accountBalance) {
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountBalance = accountBalance;
    }
}
