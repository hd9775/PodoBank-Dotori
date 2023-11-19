package com.yongy.dotorimainservice.domain.planDetail.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class PlanDetailListResDto {

    private String categoryTitle; // 카테고리 이름

    private BigDecimal expense; // 지출

    private BigDecimal savings; // 저축
}
