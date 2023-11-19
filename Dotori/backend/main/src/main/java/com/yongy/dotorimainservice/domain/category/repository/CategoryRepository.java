package com.yongy.dotorimainservice.domain.category.repository;

import com.yongy.dotorimainservice.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByUserSeq(Long userSeq);
    Category findByCategorySeq(Long categorySeq);

    Category findByCategoryTitleAndUserSeq(String categoryTitle, Long userSeq);
}
