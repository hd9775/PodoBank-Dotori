package com.yongy.dotoripurposeservice.domain.purposeData.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PurposeDataDTO {
    private String dataName;
    private BigDecimal dataAmount;
    private BigDecimal dataCurrentBalance;
    private String dataCreatedAt;

}
