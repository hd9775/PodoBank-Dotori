package com.bank.podo.domain.fcm.entity;

import com.bank.podo.global.others.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class FCMToken extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column
    private String token;

    @Builder
    public FCMToken(String email, String token) {
        this.email = email;
        this.token = token;
    }

    public void updateToken(String token) {
        this.token = token;
    }
}
