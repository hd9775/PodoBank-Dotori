package com.yongy.dotorimainservice.domain.payment.dto.request;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentPodoReqDto {
    private Long accountSeq;
    private Long planSeq;

    @Builder
    public PaymentPodoReqDto(Long accountSeq, Long planSeq) {
        this.accountSeq = accountSeq;
        this.planSeq = planSeq;
    }
}
