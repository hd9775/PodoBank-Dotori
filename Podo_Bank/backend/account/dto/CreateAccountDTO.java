package com.bank.podo.domain.account.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateAccountDTO {
    private Long accountCategoryId;
    private String password;
}
