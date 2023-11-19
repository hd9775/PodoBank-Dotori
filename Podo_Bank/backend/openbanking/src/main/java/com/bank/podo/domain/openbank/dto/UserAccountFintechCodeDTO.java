package com.bank.podo.domain.openbank.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAccountFintechCodeDTO {
    private String fintechCode;
    private String accountNumber;
    private String serviceCode;
}
