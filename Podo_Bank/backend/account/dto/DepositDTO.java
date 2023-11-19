package com.bank.podo.domain.account.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class DepositDTO {
    private String accountNumber;
    private BigDecimal amount;
    private String password;
    private String content;
    private String businessCode;
}
