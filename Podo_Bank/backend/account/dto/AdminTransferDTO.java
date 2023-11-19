package com.bank.podo.domain.account.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class AdminTransferDTO {
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private String senderContent;
    private String receiverContent;
}
