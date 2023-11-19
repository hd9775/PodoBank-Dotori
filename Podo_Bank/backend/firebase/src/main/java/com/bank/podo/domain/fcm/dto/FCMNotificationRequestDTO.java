package com.bank.podo.domain.fcm.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FCMNotificationRequestDTO {
    private String targetUserEmail;
    private String title;
    private String body;

    @Builder
    public FCMNotificationRequestDTO(String targetUserEmail, String title, String body) {
        this.targetUserEmail = targetUserEmail;
        this.title = title;
        this.body = body;
    }

}
