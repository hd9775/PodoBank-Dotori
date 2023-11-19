package com.yongy.dotorimainservice.domain.chatGPT.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;


@Getter
public class Choice {
    int index;
    Message message;
    @JsonProperty("finish_reason")
    String finishReason;
}
