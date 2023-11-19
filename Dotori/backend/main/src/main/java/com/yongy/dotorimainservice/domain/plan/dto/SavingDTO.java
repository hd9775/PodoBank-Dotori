package com.yongy.dotorimainservice.domain.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Getter
@ToString
@Builder
@AllArgsConstructor
public class SavingDTO {
    Long planSeq;
    List<PurposeSavingDTO> purposeSavingList;
    BigDecimal totalSaving;
}
