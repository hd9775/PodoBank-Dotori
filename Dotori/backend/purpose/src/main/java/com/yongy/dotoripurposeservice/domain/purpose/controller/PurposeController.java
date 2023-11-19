package com.yongy.dotoripurposeservice.domain.purpose.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotoripurposeservice.domain.purpose.dto.*;
import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.SavingDTO;
import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.SavingDataDTO;
import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.UserReqDto;
import com.yongy.dotoripurposeservice.domain.purpose.service.PurposeServiceImpl;
import com.yongy.dotoripurposeservice.domain.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/purpose")
public class PurposeController {
    private final PurposeServiceImpl purposeService;


    @Operation(summary = "새로운 목표 생성")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "목표 생성 성공")
    })
    @PostMapping()
    public ResponseEntity<Void> createPurpose(@RequestBody PurposeDTO purposeDTO){
        // 새로운 목표 생성
        purposeService.createPurpose(purposeDTO);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "전체 목표 리스트 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "목표 리스트 조회 성공")
    })
    @GetMapping()
    public ResponseEntity<PurposeAllDTO> findAllPurpose(){
        // 전체 목표 리스트 조회
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PurposeAllDTO result = purposeService.findAllPurpose(user.getUserSeq());
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "목표 상세 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "목표 상세 조회 성공")
    })
    @GetMapping("/{purposeSeq}")
    public ResponseEntity<PurposeDetailDTO> findPurposeDetail(@PathVariable("purposeSeq") Long purposeSeq){
        // 목표 조회
        // TODO 로그인 된 사용자의 purpose가 맞는지 확인하는 작업 필요
        PurposeDetailDTO purposeDetailDTO = purposeService.findPurposeDetail(purposeSeq);
        return ResponseEntity.ok(purposeDetailDTO);
    }


    @Operation(summary = "목표 중단")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "목표 중단 성공")
    })
    @PatchMapping("/terminate/{purposeSeq}")
    public ResponseEntity<Void> terminatePurpose(@PathVariable("purposeSeq") Long purposeSeq){
        // 목표 중단하기
        purposeService.terminatePurpose(purposeSeq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "목표 진행 현황")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "목표 진행 현황 반환 성공")
    })
    @GetMapping("/terminate/{purposeSeq}")
    public ResponseEntity<PurposeSummaryDTO> terminateCheck(@PathVariable("purposeSeq") Long purposeSeq){
        // 목표 중단하기 눌렀을 때 현재 목표 진행 현황 보여줌
        PurposeSummaryDTO summary = purposeService.summarizePurpose(purposeSeq);
        return ResponseEntity.ok(summary);
    }

    // ----------- 통신 -----------
    @PostMapping("/communication")
    public ResponseEntity<BigDecimal> getUserTotalMoney(@RequestBody UserReqDto userReqDto){
        log.info("--come--");
        PurposeAllDTO purposeAllDTO = purposeService.findAllPurpose(userReqDto.getUserSeq());
        log.info("--test--");
        return ResponseEntity.ok(purposeAllDTO.getCurrentTotalSavings());
    }

    @PostMapping("/saving")
    public ResponseEntity<Void> saving(@RequestBody SavingDataDTO savingDataDTO){
        purposeService.saving(savingDataDTO);
        return ResponseEntity.ok().build();
    }


    @Operation(summary = "목표 종료")
    @PatchMapping("/finished")
    public ResponseEntity<Void> purposeFinished(@RequestBody PurposeFinisedDTO purposeFinisedDTO) throws ParseException, JsonProcessingException {
        purposeService.purposeFinised(purposeFinisedDTO);
        return ResponseEntity.ok().build();
    }
}
