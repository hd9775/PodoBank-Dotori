package com.yongy.dotorimainservice.domain.chatGPT.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDetailDTO {
    String id;
    String object;
    Long created;
    String model;
    List<Choice> choices;
    Usage usage;

    @Override
    public String toString() {
        return "ResponseDetailDTO{" +
                "choices=" + choices +
                '}';
    }
}
