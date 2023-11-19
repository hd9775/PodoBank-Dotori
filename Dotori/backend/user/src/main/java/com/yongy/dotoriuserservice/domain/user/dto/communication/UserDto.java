package com.yongy.dotoriuserservice.domain.user.dto.communication;

import com.yongy.dotoriuserservice.domain.user.entity.Provider;
import com.yongy.dotoriuserservice.domain.user.entity.Role;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDto {

    private Long userSeq;

    private Role role;

    private String id;

    private String password;

    private LocalDate birthDate;

    private String userName;

    private String phoneNumber;

    private Provider authProvider;

    private LocalDateTime expiredAt;

    @Builder
    public UserDto(Long userSeq, Role role, String id, String password, LocalDate birthDate, String userName, String phoneNumber, Provider authProvider, LocalDateTime expiredAt) {
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