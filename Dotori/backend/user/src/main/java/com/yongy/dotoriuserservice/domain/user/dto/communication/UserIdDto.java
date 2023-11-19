package com.yongy.dotoriuserservice.domain.user.dto.communication;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserIdDto {
    private String id;

    @Builder
    public UserIdDto(String id) {
        this.id = id;
    }
}
