package com.bank.podo.global.email.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailVerificationSuccessDTO {
    private String email;
    private String successCode;
    private String verificationType;
}

