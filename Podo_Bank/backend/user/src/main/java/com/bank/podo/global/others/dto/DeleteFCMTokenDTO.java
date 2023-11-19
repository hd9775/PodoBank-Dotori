package com.bank.podo.global.others.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DeleteFCMTokenDTO {
    private String email;

    @Builder
    public DeleteFCMTokenDTO(String email) {
        this.email = email;
    }
}
