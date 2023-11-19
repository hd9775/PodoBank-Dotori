package com.yongy.dotorimainservice.domain.payment.dto.response;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@Builder
public class PaymentPodoResDto {
    private LocalDateTime transactionAt; // 시간
    private BigDecimal amount; // 출금금액
    private BigDecimal balanceAfter; // 잔액
    private String content; // 사업자이름
    private String code; // 사업자코드


}
