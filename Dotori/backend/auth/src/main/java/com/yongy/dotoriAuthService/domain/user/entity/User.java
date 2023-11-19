package com.yongy.dotoriAuthService.domain.user.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@Entity(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_seq")
    private Long userSeq;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String id;

    private String password;

    private LocalDate birthDate;

    @Column(name="user_name", nullable = false)
    private String userName;

    private String phoneNumber;

    @Column(name="security_number")
    private String securityNumber;

    @Enumerated(EnumType.STRING)
    @Column(name="auth_provider", nullable = false)
    private Provider authProvider;

    @Column(name="expired_at", nullable = true)
    private LocalDateTime expiredAt;

    @Builder
    public User(Long userSeq,Role role, String id, String password, LocalDate birthDate, String userName, String phoneNumber, Provider authProvider, LocalDateTime expiredAt) {
        this.userSeq = userSeq;
        this.role = role;
        this.id = id;
        this.password = password;
        this.birthDate = birthDate;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.authProvider = authProvider;
        this.expiredAt = expiredAt;
    }
}
