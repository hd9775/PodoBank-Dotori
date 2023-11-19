package com.yongy.dotorimainservice.domain.chatGPT.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class Usage {
    @JsonProperty("prompt_tokens")
    int promptTokens;
    @JsonProperty("completion_tokens")
    int completionTokens;
    @JsonProperty("total_tokens")
    int totalTokens;
}
