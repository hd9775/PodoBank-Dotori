package com.bank.podo.domain.account.dto;

import lombok.Data;

@Data
public class UpdateAccountNicknameDTO {
    private String accountNumber;
    private String nickname;
}
