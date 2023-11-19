package com.bank.podo.global.others.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddFCMToken {
    private String id;
    private String email;
    private String token;
}
