package com.yongy.dotorimainservice.domain.planDetail.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanDetailDataDTO;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanDetailListResDto;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.SpecificationDTO;
import org.json.simple.parser.ParseException;

import java.util.List;

public interface PlanDetailService {
    SpecificationDTO getPlanDetail(Long planSeq) throws ParseException, JsonProcessingException;
    PlanDetailDataDTO findActiveCategoryDetail(Long planDetailSeq);
}
