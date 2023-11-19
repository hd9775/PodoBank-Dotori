package com.yongy.dotorimainservice.domain.categoryData.repository;


import com.yongy.dotorimainservice.domain.categoryData.entity.CategoryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryDataRepository extends JpaRepository<CategoryData, Long> {
    List<CategoryData> findAllByCategoryCategorySeqOrderByCountDesc(Long categorySeq);
    int deleteByDataCode(String dataCode);
    CategoryData findByDataCode(String code);

}
