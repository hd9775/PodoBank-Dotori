package com.yongy.dotorimainservice.domain.reward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RandomBoxDTO {
    Long accountSeq;
    BigDecimal amount;
}
