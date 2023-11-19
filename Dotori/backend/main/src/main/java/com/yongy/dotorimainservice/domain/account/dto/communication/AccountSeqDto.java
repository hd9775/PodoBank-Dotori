package com.yongy.dotorimainservice.domain.account.dto.communication;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountSeqDto {
    private Long accountSeq;

    @Builder
    public AccountSeqDto(Long accountSeq) {
        this.accountSeq = accountSeq;
    }
}
