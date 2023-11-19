package com.bank.podo.domain.openbank.dto;

import lombok.Data;

@Data
public class FintechOneCentVerificationCheckDTO {
    private String serviceCode;
    private String accountNumber;
    private String verificationCode;
}
