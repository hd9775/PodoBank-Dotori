package com.yongy.dotorimainservice.domain.planDetail.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ConsumeListDTO {
    private LocalDateTime transaction_at;
    private String transaction_details;
    private BigDecimal amount;
}
