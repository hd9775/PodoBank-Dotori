package com.yongy.dotorimainservice.domain.plan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.chatGPT.service.ChatGPTService;
import com.yongy.dotorimainservice.domain.plan.dto.ActivePlanDTO;
import com.yongy.dotorimainservice.domain.plan.dto.PlanDTO;
import com.yongy.dotorimainservice.domain.plan.dto.PlanStateDTO;
import com.yongy.dotorimainservice.domain.plan.dto.SavingDTO;
import com.yongy.dotorimainservice.domain.plan.dto.communication.UserSeqDto;
import com.yongy.dotorimainservice.domain.plan.dto.response.PlanListDto;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import com.yongy.dotorimainservice.domain.plan.exception.NotActivePlanException;
import com.yongy.dotorimainservice.domain.plan.service.PlanService;
import com.yongy.dotorimainservice.domain.plan.service.PlanServiceImpl;
import com.yongy.dotorimainservice.domain.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/plan")
public class PlanController {

    private final PlanService planService;
    private final ChatGPTService chatGPTService;

    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "계획 생성 성공")
    })
    @Operation(summary = "새로운 계획 등록")
    @PostMapping()
    public ResponseEntity<Void> createPlan(@RequestBody PlanDTO planDTO){
        planService.createPlan(planDTO);
        return ResponseEntity.ok().build();
    }
    //
    @Operation(summary = "실행중인 계획 중단")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "계획 중단 성공")
    })
    @PatchMapping("/stop/{planSeq}")
    public ResponseEntity<Void> terminatePlan(@PathVariable Long planSeq){
        planService.terminatePlan(planSeq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "저축하기")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "저축 성공")
    })
    @PatchMapping("/saving")
    public ResponseEntity<Void> saving(@RequestBody SavingDTO savingDTO) throws JsonProcessingException, ParseException {
        planService.saving(savingDTO);
        return ResponseEntity.ok().build();
    }


    // NOTE : 사용자의 명세서 전체 불러오기
    @Operation(summary = "전체 명세서 불러오기")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "전체 명세서 조회")
    })
    @GetMapping("/specification")
    public ResponseEntity<List<PlanListDto>> planList(){

        try{
            List<PlanListDto> planListDto = planService.getPlanList();
            return ResponseEntity.ok().body(planListDto);
        }catch(Exception e){
            throw new NotActivePlanException("가져올 데이터가 없습니다.[중지하거나 실행중인 명세서는 가져오지 않습니다]");
        }
    }


    @Operation(summary = "계획 상태 변경")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "COMPLETED 상태 변경 성공")
    })
    @PatchMapping("/completed/{planSeq}")
    public ResponseEntity<Void> updateState(@PathVariable Long planSeq){
        planService.updateState(planSeq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌에 연결된 실행중인 계획 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "실행 중인 계획 조회 성공"),
            @ApiResponse(responseCode = "404", description = "명세서 api를 호출하세요.")
    })
    @GetMapping("/{accountSeq}")
    public ResponseEntity<ActivePlanDTO> findAllPlan(@PathVariable Long accountSeq) throws IOException, ParseException {
        ActivePlanDTO result = planService.findAllPlan(accountSeq);
        return ResponseEntity.ok(result);
    }

    //-------통신-------

    @PostMapping("/communication/delete/all")
    public ResponseEntity<String> removeUserPlans(@RequestBody UserSeqDto userSeqDto){
        log.info("check-1");
        planService.removeUserPlans(userSeqDto.getUserSeq());
        log.info("check-2");
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/updateDay")
    public ResponseEntity<Void> updateDay(){
        planService.startEndPlan();
        return ResponseEntity.ok().build();
    }
}
