package com.yongy.dotoriAuthService.domain.user.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserLoginReqDto {
    private String id;
    private String password;
}
