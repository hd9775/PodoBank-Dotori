package com.yongy.dotorimainservice.domain.planDetail.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.account.service.AccountService;
import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.category.repository.CategoryRepository;
import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.payment.repository.PaymentRepository;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import com.yongy.dotorimainservice.domain.plan.repository.PlanRepository;
import com.yongy.dotorimainservice.domain.plan.service.PlanService;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.ConsumeListDTO;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanDetailDataDTO;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.PlanDetailListResDto;
import com.yongy.dotorimainservice.domain.planDetail.dto.response.SpecificationDTO;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import com.yongy.dotorimainservice.domain.planDetail.exception.NotFoundPlanDetailException;
import com.yongy.dotorimainservice.domain.planDetail.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanDetailServiceImpl implements PlanDetailService{
    private final PlanRepository planRepository;
    private final PlanService planService;
    private final PlanDetailRepository planDetailRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentRepository paymentRepository;
    private final AccountService accountService;

    // NOTE : 명세서 가져오기
    public SpecificationDTO getPlanDetail(Long planSeq) throws ParseException, JsonProcessingException {

        List<PlanDetail> planDetailList = planDetailRepository.findAllByPlanPlanSeq(planSeq);
        List<PlanDetailListResDto> resultPlanDetailList = new ArrayList<>();

        for (PlanDetail planDetail : planDetailList) {
            Category category = categoryRepository.findByCategorySeq(planDetail.getCategory().getCategorySeq());
            resultPlanDetailList.add(PlanDetailListResDto.builder()
                    .categoryTitle(category.getCategoryTitle()) // 카테고리 이름
                    .expense(planDetail.getDetailLimit().subtract(planDetail.getDetailBalance())) // 소비
                    .savings(planDetail.getDetailBalance()).build()); // 저축
        }

        // NOTE : [종료하기] or [저축하기] 버튼을 누르지 않았으면 포도은행의 계좌의 전체 금액을 가져온다.
        BigDecimal currentAmount = new BigDecimal(-1);
        Plan plan = planService.findByPlanSeq(planSeq);
        if(plan.getPlanState().equals(State.ACTIVE) && plan.getTerminatedAt() != null){
            currentAmount = accountService.getBalance(plan.getAccount().getAccountSeq());
        }


        return SpecificationDTO.builder()
                .planDetailList(resultPlanDetailList)
                .additionalSaving(planRepository.findByPlanSeq(planSeq).getAdditionalSaving()) // 저축전이면 null
                .currentAmount(currentAmount)
                .build();
    }

    @Override
    public PlanDetailDataDTO findActiveCategoryDetail(Long planDetailSeq) {
        PlanDetail planDetail = planDetailRepository.findByPlanDetailSeq(planDetailSeq);

        if(planDetail == null){
            throw new NotFoundPlanDetailException("해당 카테고리가 존재하지 않습니다.");
        }

        Category category = categoryRepository.findByCategorySeq(planDetail.getCategory().getCategorySeq());
        List<Payment> payments = paymentRepository.findAllByPlanDetailSeqAndChecked(planDetailSeq, true);
        List<ConsumeListDTO> consumeList = new ArrayList<>();

        for(Payment payment : payments){
            consumeList.add(ConsumeListDTO.builder()
                            .transaction_details(payment.getPaymentName())
                            .amount(payment.getPaymentPrice())
                            .transaction_at(payment.getPaymentDate())
                    .build());
        }

        PlanDetailDataDTO result = PlanDetailDataDTO.builder()
                .categoryName(category.getCategoryTitle())
                .targetMoney(planDetail.getDetailLimit())
                .currentMoney(planDetail.getDetailBalance())
                .consumeList(consumeList)
                .build();

        return result;
    }
}
