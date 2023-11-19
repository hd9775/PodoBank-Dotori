package com.yongy.dotoriAuthService.domain.user.dto.request;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserInfoReqDto {
    private String id;
    private String password;
    private String userName;
    private String birthDate;
    private String phoneNumber;

}
