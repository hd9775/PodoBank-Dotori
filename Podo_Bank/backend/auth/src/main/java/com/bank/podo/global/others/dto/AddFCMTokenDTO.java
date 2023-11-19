package com.bank.podo.global.others.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddFCMTokenDTO {
    private String email;
    private String token;

    @Builder
    public AddFCMTokenDTO(String email, String token) {
        this.email = email;
        this.token = token;
    }
}
