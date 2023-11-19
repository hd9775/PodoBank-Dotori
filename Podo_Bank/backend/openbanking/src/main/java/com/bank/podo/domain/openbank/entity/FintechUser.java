package com.bank.podo.domain.openbank.entity;

import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FintechUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fintechId;

    @Column(nullable = false)
    private String fintechCode;

    @Column
    private boolean locked;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private FintechService fintechService;

    @Column
    private String accountNumber;

    @Column
    private String bankName;

    @Builder
    public FintechUser(String fintechCode, boolean locked, FintechService fintechService, String accountNumber) {
        this.fintechCode = fintechCode;
        this.locked = locked;
        this.fintechService = fintechService;
        this.accountNumber = accountNumber;
    }
}
