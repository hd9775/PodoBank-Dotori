package com.yongy.dotoripurposeservice.domain.purpose.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@Builder
public class PurposeSummaryDTO {
    private String purposeTitle;
    private BigDecimal goalAmount;
    private BigDecimal currentBalance;
    private BigDecimal restAmount;
    private BigDecimal percentage;
}
