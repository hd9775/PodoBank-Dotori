package com.yongy.dotorimainservice.domain.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActiveCategoryDTO {
    String categoryName;
    BigDecimal targetAmount;

    @Override
    public String toString() {
        return "{" +
                "categoryName='" + categoryName + '\'' +
                ", targetAmount=" + targetAmount +
                '}';
    }
}
