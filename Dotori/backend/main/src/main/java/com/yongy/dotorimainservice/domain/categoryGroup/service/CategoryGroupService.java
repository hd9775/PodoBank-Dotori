package com.yongy.dotorimainservice.domain.categoryGroup.service;


import com.yongy.dotorimainservice.domain.categoryGroup.dto.CategoryGroupDTO;

import java.util.List;

public interface CategoryGroupService {
    List<CategoryGroupDTO> findAllCategoryGroup();
}
