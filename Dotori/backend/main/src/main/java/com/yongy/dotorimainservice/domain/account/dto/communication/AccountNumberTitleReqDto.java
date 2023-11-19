package com.yongy.dotorimainservice.domain.account.dto.communication;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountNumberTitleReqDto {
    private String accountNumber;
    private String accountTitle;
}
