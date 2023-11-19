package com.yongy.dotorimainservice.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;


@Getter
@Builder
@AllArgsConstructor
public class AccountListDto {
    Long accountSeq;
    String accountTitle;
    BigDecimal currentBalance;
}
