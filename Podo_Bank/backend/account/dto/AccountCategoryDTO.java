package com.bank.podo.domain.account.dto;

import com.bank.podo.domain.account.enums.AccountType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountCategoryDTO {
    private Long accountCategoryId;
    private AccountType accountType;
    private String accountName;
    private String accountDescription;
    private BigDecimal interestRate;
}
