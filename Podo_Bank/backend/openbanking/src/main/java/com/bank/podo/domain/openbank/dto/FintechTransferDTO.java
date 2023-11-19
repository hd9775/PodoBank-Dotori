package com.bank.podo.domain.openbank.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FintechTransferDTO {
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private BigDecimal amount;
    private String senderContent;
    private String receiverContent;
}
