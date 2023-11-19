package com.yongy.dotorimainservice.domain.plan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.plan.dto.ActivePlanDTO;
import com.yongy.dotorimainservice.domain.plan.dto.PlanDTO;
import com.yongy.dotorimainservice.domain.plan.dto.PlanStateDTO;
import com.yongy.dotorimainservice.domain.plan.dto.SavingDTO;
import com.yongy.dotorimainservice.domain.plan.dto.response.PlanListDto;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.List;

public interface PlanService {
    void createPlan(PlanDTO planDTO);
    void terminatePlan(Long planSeq);
    void updateState(Long planSeq);
    void saving(SavingDTO savingDTO) throws JsonProcessingException, ParseException;
    List<PlanListDto> getPlanList();
    ActivePlanDTO findAllPlan(Long accountSeq) throws IOException, ParseException;
    Plan findByPlanSeq(Long planSeq);
    void removeUserPlans(Long userSeq);

    void startEndPlan();
}
