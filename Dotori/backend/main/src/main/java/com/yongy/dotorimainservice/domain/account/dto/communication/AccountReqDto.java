package com.yongy.dotorimainservice.domain.account.dto.communication;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountReqDto {
    private String accountNumber;
    private Long userSeq;
    private Long bankSeq;
    private String fintechCode;
}
