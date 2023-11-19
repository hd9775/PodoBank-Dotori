package com.yongy.dotorimainservice.domain.account.entity;


import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@ToString
@Entity(name="accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="account_seq")
    private Long accountSeq;

    private Long userSeq; // TODO : 통신

    @ManyToOne
    @JoinColumn(name = "bankSeq")
    private Bank bank;

    private String accountNumber;

    private String accountTitle;

    @Column(name="fintech_code")
    private String fintechCode;

    private LocalDateTime deleteAt;

    @Builder
    public Account(Long accountSeq, Long userSeq, Bank bank, String accountNumber, String accountTitle, String fintechCode, LocalDateTime deleteAt) {
        this.accountSeq = accountSeq;
        this.userSeq = userSeq;
        this.bank = bank;
        this.accountNumber = accountNumber;
        this.accountTitle = accountTitle;
        this.fintechCode = fintechCode;
        this.deleteAt = deleteAt;
    }
}
