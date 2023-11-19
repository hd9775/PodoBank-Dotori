package com.yongy.dotoripurposeservice.domain.purpose.dto.communication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@ToString
@Getter
@Builder
@AllArgsConstructor
public class PurposeSavingDTO {
    Long purposeSeq;
    BigDecimal savingAmount;
}
