package com.yongy.dotoripurposeservice.global.redis.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@RequiredArgsConstructor
@RedisHash(value="PersonalAuth", timeToLive = 60 * 5)
public class PersonalAuth {

    @Id
    private String email;

    @Indexed
    private String authCode;

    public PersonalAuth(String email, String authCode) {
        this.email = email;
        this.authCode = authCode;
    }


    public static PersonalAuth of(String email, String authCode){
        return new PersonalAuth(email, authCode);
    }
}
