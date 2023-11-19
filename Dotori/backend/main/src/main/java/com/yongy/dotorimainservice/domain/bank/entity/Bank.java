package com.yongy.dotorimainservice.domain.bank.entity;


import com.yongy.dotorimainservice.domain.account.entity.Account;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Entity(name="banks")
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="bank_seq")
    private Long bankSeq;

    @Column(name="bank_name", nullable = false)
    private String bankName;

    @Column(name="bank_url", nullable = false)
    private String bankUrl;

    @Column(name="bank_id", nullable = false)
    private String bankId;

    @Column(name="bank_pwd", nullable = false)
    private String bankPwd;

    @Column(name="service_code", nullable = false)
    private String serviceCode;

    @OneToMany(mappedBy = "bank")
    private List<Account> accountList;

    @Builder
    public Bank(Long bankSeq, String bankName) {
        this.bankSeq = bankSeq;
        this.bankName = bankName;
    }
}
