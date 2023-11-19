package com.bank.podo.domain.account.entity;

import com.bank.podo.domain.account.enums.AccountType;
import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Getter
@NoArgsConstructor
public class AccountCategory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountCategoryId;

    @Column(unique = true)
    private AccountType accountType;

    @Column
    private String accountName;

    @Column
    private String accountDescription;

    @Column
    private BigDecimal interestRate;

    @Builder
    public AccountCategory(AccountType accountType, String accountName, String accountDescription, BigDecimal interestRate) {
        this.accountType = accountType;
        this.accountName = accountName;
        this.accountDescription = accountDescription;
        this.interestRate = interestRate;
    }
}
