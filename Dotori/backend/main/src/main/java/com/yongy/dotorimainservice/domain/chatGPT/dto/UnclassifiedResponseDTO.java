package com.yongy.dotorimainservice.domain.chatGPT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UnclassifiedResponseDTO {
    Long planDetailSeq;
    List<Long> paymentSeqs;
}
