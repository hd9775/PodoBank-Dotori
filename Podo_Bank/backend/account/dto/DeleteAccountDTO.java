package com.bank.podo.domain.account.dto;

import lombok.Data;

@Data
public class DeleteAccountDTO {
    private String accountNumber;
    private String password;
}
