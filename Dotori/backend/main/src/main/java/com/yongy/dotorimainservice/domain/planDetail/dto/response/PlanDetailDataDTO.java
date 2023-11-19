package com.yongy.dotorimainservice.domain.planDetail.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PlanDetailDataDTO {
    private String categoryName;
    private BigDecimal targetMoney;
    private BigDecimal currentMoney;
    private List<ConsumeListDTO> consumeList;
}
