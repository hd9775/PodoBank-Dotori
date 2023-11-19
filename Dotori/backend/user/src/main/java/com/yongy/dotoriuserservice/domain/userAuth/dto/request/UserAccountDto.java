package com.yongy.dotoriuserservice.domain.userAuth.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserAccountDto {
    private Long bankSeq;
    private String accountNumber;

}
