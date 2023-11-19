package com.bank.podo.domain.account.entity;

import com.bank.podo.domain.account.enums.AccountType;
import com.bank.podo.domain.user.entity.User;
import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@NoArgsConstructor
public class Account extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false)
    private String accountNumber;

    @Column
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(nullable = false)
    @ColumnDefault("0")
    private BigDecimal balance;

    // 만기일
    @Column
    private LocalDateTime maturityAt;

    @ManyToOne
    @JoinColumn(name = "account_category_id")
    private AccountCategory accountCategory;

    @Column
    private String loanInfo;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private int passwordRetryCount;

    @Column
    private boolean locked;

    @Column
    private boolean deleted;

    @Builder
    public Account(String accountNumber, User user, AccountType accountType, BigDecimal balance,
                   LocalDateTime maturityAt, AccountCategory accountCategory, String loanInfo,
                   String password, int passwordRetryCount, boolean locked, String nickname) {
        this.accountNumber = accountNumber;
        this.user = user;
        this.accountType = accountType;
        this.balance = balance;
        this.maturityAt = maturityAt;
        this.accountCategory = accountCategory;
        this.loanInfo = loanInfo;
        this.password = password;
        this.passwordRetryCount = passwordRetryCount;
        this.locked = locked;
        this.name = nickname;
    }

    public Account update(Account account) {
        if(account.getAccountType() != null) {
            this.accountType = account.getAccountType();
        }
        if(account.getPassword() != null) {
            this.password = account.getPassword();
        }
        if(account.getPasswordRetryCount() != -1) {
            this.passwordRetryCount = account.getPasswordRetryCount();
        }
        if(account.locked != this.locked) {
            this.locked = account.locked;
        }
        if(account.getLoanInfo() != null) {
            this.loanInfo = account.getLoanInfo();
        }
        if(account.getName() != null) {
            this.name = account.getName();
        }

        return this;
    }

    public void deposit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }

    public void withdraw(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
    }

    public void lock() {
        this.locked = true;
    }

    public void unlock() {
        this.passwordRetryCount = 0;
        this.locked = false;
    }

    public void increasePasswordRetryCount() {
        this.passwordRetryCount++;
        if (this.passwordRetryCount >= 3) {
            this.lock();
        }

    }

    public Account delete() {
        this.lock();
        this.deleted = true;

        return this;
    }
}
