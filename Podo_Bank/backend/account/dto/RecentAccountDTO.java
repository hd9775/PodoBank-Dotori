package com.bank.podo.domain.account.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentAccountDTO {
    private String accountNumber;
    private String accountName;
}
