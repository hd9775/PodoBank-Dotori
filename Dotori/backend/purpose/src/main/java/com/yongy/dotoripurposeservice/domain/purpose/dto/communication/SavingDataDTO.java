package com.yongy.dotoripurposeservice.domain.purpose.dto.communication;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SavingDataDTO {
    SavingDTO savingDTO;
    Long accountSeq;
}
