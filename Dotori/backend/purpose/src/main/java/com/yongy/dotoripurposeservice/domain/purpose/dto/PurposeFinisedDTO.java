package com.yongy.dotoripurposeservice.domain.purpose.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class PurposeFinisedDTO {
    private Long puposeSeq;
    private Long bankSeq;
    private String accountNumber;
    private BigDecimal purposeSavings;
}
