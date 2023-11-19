package com.bank.podo.domain.user.dto;

import com.bank.podo.global.email.enums.VerificationType;
import lombok.Data;

@Data
public class CheckSuccessCodeDTO {
    private String email;
    private String successCode;
    private VerificationType verificationType;
}
