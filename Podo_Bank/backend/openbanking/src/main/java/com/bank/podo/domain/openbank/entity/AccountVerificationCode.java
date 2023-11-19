package com.bank.podo.domain.openbank.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "AccountVerificationCode", timeToLive = 60 * 5)
public class AccountVerificationCode {

    @Id
    String accountNumber;

    String code;

    LocalDateTime sendAt;
}
