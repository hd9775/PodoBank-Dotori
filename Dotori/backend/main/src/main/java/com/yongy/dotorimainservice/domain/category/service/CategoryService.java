package com.yongy.dotorimainservice.domain.category.service;


import com.yongy.dotorimainservice.domain.category.dto.CategoryDetailDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDetailDTO> findAllCategory();
}

