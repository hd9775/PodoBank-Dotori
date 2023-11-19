package com.bank.podo.domain.account.entity;

import com.bank.podo.domain.user.entity.User;
import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
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

    @Column
    private String accountType;

    @Column(nullable = false)
    @ColumnDefault("0")
    private BigDecimal balance;

    // 만기일
    @Column
    private LocalDateTime maturityAt;

    @Column
    private String accountCategory;

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

}
