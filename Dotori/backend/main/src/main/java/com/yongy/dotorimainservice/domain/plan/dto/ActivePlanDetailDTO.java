package com.yongy.dotorimainservice.domain.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@Builder
public class ActivePlanDetailDTO {
    private Long planDetailSeq;
    private String title;
    private String groupTitle;
    private BigDecimal currentBalance;
    private BigDecimal goalAmount;
}
