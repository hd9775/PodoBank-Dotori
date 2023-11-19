package com.yongy.dotorimainservice.domain.plan.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
public class PlanListDto {
    private Long planSeq;
    private String accountTitle;
    private String startAt;
    private String endAt;

    @Builder
    public PlanListDto(Long planSeq, String accountTitle, String startAt, String endAt) {
        this.planSeq = planSeq;
        this.accountTitle = accountTitle;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}