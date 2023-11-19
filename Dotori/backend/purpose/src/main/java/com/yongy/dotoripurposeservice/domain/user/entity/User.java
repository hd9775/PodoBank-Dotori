package com.yongy.dotoripurposeservice.domain.user.entity;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@ToString
@NoArgsConstructor
public class User {

    private Long userSeq;

    private Role role;

    private String id;

    private String password;

    private LocalDate birthDate;

    private String userName;

    private String phoneNumber;

    private String securityNumber;

    private Provider authProvider;

    @Builder
    public User(Long userSeq, Role role, String id, String password, LocalDate birthDate, String userName, String phoneNumber, String securityNumber, Provider authProvider) {
        this.userSeq = userSeq;
        this.role = role;
        this.id = id;
        this.password = password;
        this.birthDate = birthDate;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.securityNumber = securityNumber;
        this.authProvider = authProvider;
    }


}
