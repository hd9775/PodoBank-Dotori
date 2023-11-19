package com.bank.podo.domain.fcm.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddFCMTokenDTO {
    private String email;
    private String token;
}
