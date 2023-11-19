package com.yongy.dotoripurposeservice.domain.purpose.dto;


import com.yongy.dotoripurposeservice.domain.purposeData.dto.PurposeDataDTO;
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
public class PurposeDetailDTO {
    String purposeTitle;
    BigDecimal currentBalance;
    BigDecimal goalAmount;
    String startedAt;
    String endAt;
    List<PurposeDataDTO> purposeDataList;
}
