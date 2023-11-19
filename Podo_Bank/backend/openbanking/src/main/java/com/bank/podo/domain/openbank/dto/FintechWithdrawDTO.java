package com.bank.podo.domain.openbank.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FintechWithdrawDTO {
    private String serviceCode;
    private String fintechCode;
    private BigDecimal amount;
    private String content;
}
