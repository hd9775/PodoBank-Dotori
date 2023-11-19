package com.yongy.dotorimainservice.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class PaymentDetailDTO {

    Long planDetailSeq;
    String categoryName;
    Long paymentSeq;
    String paymentName;
    BigDecimal paymentPrice;
    String paymentDate;

}
