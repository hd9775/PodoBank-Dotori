package com.yongy.dotoripurposeservice.domain.purpose.dto.communication;

import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class SavingDTO {
    Long planSeq;
    List<PurposeSavingDTO> purposeSavingList;
    BigDecimal totalSaving;
}
