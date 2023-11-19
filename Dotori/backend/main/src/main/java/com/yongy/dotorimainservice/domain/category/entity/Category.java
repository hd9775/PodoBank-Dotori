package com.yongy.dotorimainservice.domain.category.entity;


import com.yongy.dotorimainservice.domain.categoryData.entity.CategoryData;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Entity(name = "categories")
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_seq")
    private Long categorySeq;

    private Long userSeq;

    @Column(name = "category_title", nullable = false)
    private String categoryTitle;

    @OneToMany(mappedBy = "category")
    private List<PlanDetail> planDetailList;

    @OneToMany(mappedBy = "category")
    private List<CategoryData> categoryDataList;

    @Builder
    public Category(Long categorySeq, Long userSeq, String categoryTitle) {
        this.categorySeq = categorySeq;
        this.userSeq = userSeq;
        this.categoryTitle = categoryTitle;
    }

    @Override
    public String toString() {
        return "categoryTitle='" + categoryTitle + '\'';
    }
}
