package com.bank.podo.domain.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class UserInfoDTO {
    private String name;
    private LocalDate birthdate;
    private String email;
    private String phoneNumber;

    @Builder
    public UserInfoDTO(String name, LocalDate birthdate, String email, String phoneNumber) {
        this.name = name;
        this.birthdate = birthdate;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

}
