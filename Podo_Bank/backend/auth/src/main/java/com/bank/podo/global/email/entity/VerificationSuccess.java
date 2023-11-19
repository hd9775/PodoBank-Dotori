package com.bank.podo.global.email.entity;

import com.bank.podo.global.email.enums.VerificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "verificationSuccess", timeToLive = 60 * 10)
public class VerificationSuccess {

    @Id
    String email;

    String successCode;

    VerificationType type;

    LocalDateTime successAt;
}
