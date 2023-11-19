package com.yongy.dotorimainservice.domain.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDetailDTO {
    private Long categorySeq;
    private String categoryTitle;
}
