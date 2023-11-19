package com.yongy.dotorimainservice.domain.planDetail.entity;


import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.categoryGroup.entity.CategoryGroup;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity(name="plan_details")
public class PlanDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_detail_seq")
    private Long planDetailSeq;

    @ManyToOne
    @JoinColumn(name="planSeq")
    private Plan plan;

    @ManyToOne
    @JoinColumn(name="categorySeq")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "categoryGroupSeq")
    private CategoryGroup categoryGroup;

    @Column(name = "detail_limit", nullable = false)
    private BigDecimal detailLimit;

    @Column(name = "detail_balance", nullable = false)
    private BigDecimal detailBalance;


    @Builder
    public PlanDetail(Long planDetailSeq, Plan plan, Category category, CategoryGroup categoryGroup, BigDecimal detailLimit, BigDecimal detailBalance) {
        this.planDetailSeq = planDetailSeq;
        this.plan = plan;
        this.category = category;
        this.categoryGroup = categoryGroup;
        this.detailLimit = detailLimit;
        this.detailBalance = detailBalance;
    }

    @Override
    public String toString() {
        return "{ planDetailSeq=" + planDetailSeq +
                ", " + category+"}";
    }

    public PlanDetail updateBalance(BigDecimal amount) {
        this.detailBalance = this.getDetailBalance().add(amount);
        return this;
    }
}
