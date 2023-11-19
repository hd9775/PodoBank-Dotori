package com.bank.podo.global.request;

import com.bank.podo.global.others.dto.AddFCMTokenDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RequestUtil {

    @Value("${http.request.firebase.url}")
    private String firebaseUrl;

    private final RequestApi requestApi;

    @Async
    public void addFCMToken(String email, String token) {
        String url = firebaseUrl + "/api/v1/fcm/addToken";

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(AddFCMTokenDTO.builder()
                    .email(email)
                    .token(token)
                    .build());
            requestApi.apiPost(url, json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
