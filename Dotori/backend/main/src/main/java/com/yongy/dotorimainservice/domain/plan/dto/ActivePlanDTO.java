package com.yongy.dotorimainservice.domain.plan.dto;


import com.yongy.dotorimainservice.domain.plan.entity.State;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ActivePlanDTO {
    private BigDecimal accountBalance;
    private LocalDateTime startedAt;
    private LocalDateTime endAt;
    private LocalDateTime terminatedAt;
    private State state;
    private Long planSeq;
    private Long unclassified; // 미분류 개수
    private List<ActivePlanDetailDTO> activePlanList;
}
