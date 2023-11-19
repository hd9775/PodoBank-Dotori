package com.yongy.dotorimainservice.domain.categoryData.service;


import com.yongy.dotorimainservice.domain.categoryData.dto.response.CategoryDataResDto;
import com.yongy.dotorimainservice.domain.categoryData.entity.CategoryData;
import com.yongy.dotorimainservice.domain.categoryData.repository.CategoryDataRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@Transactional
public class CategoryDataServiceImpl implements CategoryDataService{

    @Autowired
    private CategoryDataRepository categoryDataRepository;

    public List<CategoryDataResDto> findCategoryData(Long categorySeq){
        List<CategoryData> categoryDataList = categoryDataRepository.findAllByCategoryCategorySeqOrderByCountDesc(categorySeq);
        List<CategoryDataResDto> categoryDataResDto = null;

        for(CategoryData categoryData : categoryDataList){
            categoryDataResDto.add(CategoryDataResDto.builder()
                    .dataCode(categoryData.getDataCode())
                    .dataName(categoryData.getDataName())
                    .count(categoryData.getCount()).build());
        }

        return categoryDataResDto;
    }

    public int deleteByDataCode(String dataCode){
        return categoryDataRepository.deleteByDataCode(dataCode);
    }
}
