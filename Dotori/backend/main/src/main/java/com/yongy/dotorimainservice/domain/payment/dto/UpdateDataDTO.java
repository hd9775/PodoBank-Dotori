package com.yongy.dotorimainservice.domain.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateDataDTO {
    Long planDetailSeq;
    Long paymentSeq;
}
