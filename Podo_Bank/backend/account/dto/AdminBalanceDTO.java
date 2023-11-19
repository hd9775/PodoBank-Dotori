package com.bank.podo.domain.account.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminBalanceDTO {
    private String accountNumber;
    private BigDecimal balance;
}
