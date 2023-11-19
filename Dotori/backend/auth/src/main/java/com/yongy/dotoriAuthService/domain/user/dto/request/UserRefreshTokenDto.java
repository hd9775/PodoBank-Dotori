package com.yongy.dotoriAuthService.domain.user.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserRefreshTokenDto {
    private String refreshToken;

    public UserRefreshTokenDto(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
