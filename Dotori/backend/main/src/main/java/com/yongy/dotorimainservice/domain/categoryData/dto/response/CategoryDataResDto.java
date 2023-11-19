package com.yongy.dotorimainservice.domain.categoryData.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
@AllArgsConstructor
public class CategoryDataResDto {
    private String dataCode;
    private String dataName;
    private int count;
}
