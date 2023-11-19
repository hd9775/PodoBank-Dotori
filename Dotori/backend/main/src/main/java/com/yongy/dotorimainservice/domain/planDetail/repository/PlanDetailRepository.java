package com.yongy.dotorimainservice.domain.planDetail.repository;

import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanDetailRepository extends JpaRepository<PlanDetail, Long> {
    List<PlanDetail> findAllByPlanPlanSeq(Long planSeq);
    PlanDetail findByCategory(Category category);
    PlanDetail findByPlanDetailSeq(Long planDetailSeq);


}
