package com.bank.podo.domain.account.dto;

import lombok.Data;

@Data
public class ResetAccountPasswordDTO {
    private String accountNumber;
    private String newPassword;
    private String successCode;
}
