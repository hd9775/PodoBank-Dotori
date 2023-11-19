package com.yongy.dotorimainservice.domain.plan.dto;

import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@ToString
public class PurposeSavingDTO {
    Long purposeSeq;
    BigDecimal savingAmount;
}
