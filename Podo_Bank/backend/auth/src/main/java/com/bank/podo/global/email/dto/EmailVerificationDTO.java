package com.bank.podo.global.email.dto;

import com.bank.podo.global.email.enums.VerificationType;
import lombok.Data;

@Data
public class EmailVerificationDTO {
    private String email;
    private VerificationType type;
}
