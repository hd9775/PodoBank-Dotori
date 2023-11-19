package com.yongy.dotoriuserservice.global.redis.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@RequiredArgsConstructor
@RedisHash(value="BankRefreshToken", timeToLive = 60 * 60 * 24 * 3) // 5일
public class BankRefreshToken {

    @Id
    private String bankName;

    @Indexed
    private String token;


    public BankRefreshToken(String bankName, String token) {
        this.bankName = bankName;
        this.token = token;
    }

    public static BankRefreshToken of(String bankName, String token){
        return new BankRefreshToken(bankName, token);
    }
}

