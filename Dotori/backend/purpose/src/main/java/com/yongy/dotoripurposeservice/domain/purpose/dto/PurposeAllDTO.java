package com.yongy.dotoripurposeservice.domain.purpose.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurposeAllDTO {
    private BigDecimal currentTotalSavings;
    private List<PurposeListDTO> purposeList;
}
