package com.bank.podo.domain.openbank.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FintechUserHistoryDTO {
    private String serviceCode;
    private String fintechCode;
    private LocalDateTime startAt;
}
