package com.yongy.dotoripurposeservice.domain.purpose.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PurposeListDTO {
    private Long purposeSeq;
    private String title;
    private BigDecimal currentBalance;
    private BigDecimal goalAmount;
    private LocalDateTime terminatedAt;
    private LocalDate startedAt;
}
