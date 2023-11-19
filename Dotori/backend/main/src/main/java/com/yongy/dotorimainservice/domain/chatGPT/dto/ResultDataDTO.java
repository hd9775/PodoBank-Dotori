package com.yongy.dotorimainservice.domain.chatGPT.dto;

import com.yongy.dotorimainservice.domain.plan.dto.ActiveCategoryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ResultDataDTO {
    String categoryGroupName;
    List<ActiveCategoryDTO> categories;
}
