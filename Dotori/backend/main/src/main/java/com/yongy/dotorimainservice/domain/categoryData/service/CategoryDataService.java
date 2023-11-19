package com.yongy.dotorimainservice.domain.categoryData.service;


import com.yongy.dotorimainservice.domain.categoryData.dto.response.CategoryDataResDto;

import java.util.List;

public interface CategoryDataService {
    List<CategoryDataResDto> findCategoryData(Long categorySeq);
    int deleteByDataCode(String dataCode);
}
