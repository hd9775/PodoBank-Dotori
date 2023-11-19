package com.bank.podo.domain.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckSuccessCodeDTO {
    private String email;
    private String successCode;
    private String verificationType;
}

