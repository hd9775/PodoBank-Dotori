package com.yongy.dotorimainservice.domain.chatGPT.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

// chatGPT에 요청할 DTO
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestDTO {
    private String model;
    private List<Message> messages;
    private Double temperature;
    @JsonProperty("max_tokens")
    private Integer maxTokens;
    @JsonProperty("top_p")
    private Integer topP;
    @JsonProperty("frequency_penalty")
    private Integer frequencyPenalty;
    @JsonProperty("presence_penalty")
    private Integer presencePenalty;
}
