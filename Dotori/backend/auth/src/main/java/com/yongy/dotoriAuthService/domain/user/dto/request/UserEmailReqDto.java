package com.yongy.dotoriAuthService.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserEmailReqDto {
    private String id;
    private String code;
}
