package com.bank.podo.global.email.dto;

import com.bank.podo.global.email.enums.VerificationType;
import lombok.Data;

@Data
public class EmailVerificationCheckDTO {
    private String email;
    private String code;
    private VerificationType type;
}
