package com.bank.podo.domain.openbank.entity;

import com.bank.podo.domain.user.entity.User;
import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class FintechService extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String serviceCode;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String accountNumber;
}
