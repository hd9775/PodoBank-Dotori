package com.yongy.dotoriuserservice.domain.user.dto.response;

import com.yongy.dotoriuserservice.domain.user.entity.Provider;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserInfoResDto {

    private Long userSeq;

    private String id;

    private LocalDate birthDate;

    private String userName;

    private String phoneNumber;

    private Provider authProvider;

    @Builder
    public UserInfoResDto(Long userSeq, String id, LocalDate birthDate, String userName, String phoneNumber, Provider authProvider) {
        this.userSeq = userSeq;
        this.id = id;
        this.birthDate = birthDate;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.authProvider = authProvider;
    }
}
