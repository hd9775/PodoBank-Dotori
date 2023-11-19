package com.yongy.dotorimainservice.domain.payment.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.account.service.AccountService;
import com.yongy.dotorimainservice.domain.payment.dto.PaymentDetailDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UnclassifiedDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UpdateDataDTO;
import com.yongy.dotorimainservice.domain.payment.dto.request.PaymentPodoReqDto;
import com.yongy.dotorimainservice.domain.payment.dto.response.PaymentPodoResDto;
import com.yongy.dotorimainservice.domain.payment.service.PaymentService;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.exception.PaymentUpdateBeforeException;
import com.yongy.dotorimainservice.domain.plan.repository.PlanRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@RestController
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private AccountService accountService;

    // NOTE : 결제내역 가져오기
    @PostMapping("/listAll")
    public ResponseEntity<List<PaymentPodoResDto>> updatePayments(@RequestBody PaymentPodoReqDto paymentPodoReqDto) throws ParseException, JsonProcessingException {

        Plan plan = planRepository.findByPlanSeq(paymentPodoReqDto.getPlanSeq());

        LocalDateTime currentTime = LocalDateTime.now(); // 현재시간

        // 현재 찾으려는 시간이 업데이트한 시간보다 이전이다.
        if(currentTime.isBefore(plan.getUpdatedAt())){
            throw new PaymentUpdateBeforeException("이미 이전에 업데이트를 했음");
        }

        // 업데이트를 하려는 날짜, 계좌의 sequence
        List<PaymentPodoResDto> paymenetList;
        paymenetList = paymentService.getPayments(plan.getUpdatedAt(), paymentPodoReqDto.getAccountSeq());


        // 업데이트한 날짜 저장
        plan.setUpdatedAt(currentTime);
        planRepository.save(plan);


        return ResponseEntity.ok(paymenetList);
    }

    @Operation(summary = "미분류 Payment 리스트 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "미분류 내역 조회")
    })
    @GetMapping("/{planSeq}")
    public ResponseEntity<List<PaymentDetailDTO>> findAllUnclassified(@PathVariable Long planSeq){
        return ResponseEntity.ok().body(paymentService.findAllUnclassified(planSeq));
    }

    @Operation(summary = "미분류 Payment category 수정 확인")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "미분류 사용자 확인")
    })
    @PatchMapping("/{planSeq}")
    public ResponseEntity<Void> updateUnclassified(@PathVariable Long planSeq, @RequestBody UnclassifiedDTO updateDataDTOList){
        paymentService.updateUnclassified(planSeq, updateDataDTOList);
        return ResponseEntity.ok().build();
    }
}
