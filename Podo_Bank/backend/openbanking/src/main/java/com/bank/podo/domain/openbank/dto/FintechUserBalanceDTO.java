package com.bank.podo.domain.openbank.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class FintechUserBalanceDTO {
    private String accountNumber;
    private BigDecimal balance;
}
