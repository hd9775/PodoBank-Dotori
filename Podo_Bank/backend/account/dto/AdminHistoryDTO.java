package com.bank.podo.domain.account.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminHistoryDTO {
    private String accountNumber;
    private LocalDateTime startAt;
}
