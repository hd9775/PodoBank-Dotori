package com.bank.podo.domain.account.dto;

import com.bank.podo.domain.account.enums.AccountType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AccountDTO {
    private String accountNumber;
    private AccountType accountType;
    private String balance;
    private LocalDateTime createAt;
    private BigDecimal interestRate;
    private String nickname;

    @Builder
    public AccountDTO(String accountNumber, AccountType accountType, String balance, LocalDateTime createAt, BigDecimal interestRate, String nickname) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.createAt = createAt;
        this.interestRate = interestRate;
        this.nickname = nickname;
    }
}
