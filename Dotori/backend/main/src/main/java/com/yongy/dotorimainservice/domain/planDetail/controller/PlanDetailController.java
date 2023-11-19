package com.yongy.dotorimainservice.domain.planDetail.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanDetailDataDTO;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanSeqDTO;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.SpecificationDTO;
import com.yongy.dotorimainservice.domain.planDetail.service.PlanDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/planDetail")
public class PlanDetailController {

    @Autowired
    private PlanDetailService planDetailService;

    // NOTE : 명세서 가져오기
    @Operation(summary = "명세서 상세 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "명세서 상세 조회 성공")
    })
    @GetMapping("/specification/{planSeq}")
    public ResponseEntity<SpecificationDTO> getPlanDetail(@PathVariable Long planSeq) throws ParseException, JsonProcessingException {
        SpecificationDTO specificationDTO = planDetailService.getPlanDetail(planSeq);
        return ResponseEntity.ok().body(specificationDTO);
    }

    @Operation(summary = "실행 중인 카테고리 상세 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "실행 중인 카테고리 상세 조회 성공")
    })
    @GetMapping("/{planDetailSeq}")
    public ResponseEntity<PlanDetailDataDTO> findActiveCategoryDetail(@PathVariable Long planDetailSeq){
        PlanDetailDataDTO result = planDetailService.findActiveCategoryDetail(planDetailSeq);
        return ResponseEntity.ok(result);
    }
}
