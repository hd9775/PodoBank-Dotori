package com.yongy.dotorimainservice.domain.categoryGroup.entity;


import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Entity(name = "category_groups")
@NoArgsConstructor
public class CategoryGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_group_seq")
    private Long categoryGroupSeq;

    private Long userSeq;

    @Column(name = "group_title", nullable = false)
    private String groupTitle;

    @OneToMany(mappedBy = "categoryGroup")
    private List<PlanDetail> planDetailList;


    @Builder
    public CategoryGroup(Long categoryGroupSeq, Long userSeq, String groupTitle) {
        this.categoryGroupSeq = categoryGroupSeq;
        this.userSeq = userSeq;
        this.groupTitle = groupTitle;
    }
}
