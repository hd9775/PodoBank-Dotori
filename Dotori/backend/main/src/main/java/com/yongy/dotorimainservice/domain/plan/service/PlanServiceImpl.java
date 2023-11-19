package com.yongy.dotorimainservice.domain.plan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.account.exception.ExistAccountNumberException;
import com.yongy.dotorimainservice.domain.account.exception.NotFoundAccountNumberException;
import com.yongy.dotorimainservice.domain.account.repository.AccountRepository;
import com.yongy.dotorimainservice.domain.account.service.AccountService;
import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import com.yongy.dotorimainservice.domain.bank.repository.BankRepository;
import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.category.repository.CategoryRepository;
import com.yongy.dotorimainservice.domain.categoryGroup.entity.CategoryGroup;
import com.yongy.dotorimainservice.domain.categoryGroup.repository.CategoryGroupRepository;
import com.yongy.dotorimainservice.domain.chatGPT.service.ChatGPTService;
import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.payment.repository.PaymentRepository;
import com.yongy.dotorimainservice.domain.plan.dto.*;
import com.yongy.dotorimainservice.domain.plan.dto.response.PlanListDto;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import com.yongy.dotorimainservice.domain.plan.exception.ExistTerminatedPlanException;
import com.yongy.dotorimainservice.domain.plan.exception.NotActivePlanException;
import com.yongy.dotorimainservice.domain.plan.exception.PurposeServiceFailedException;
import com.yongy.dotorimainservice.domain.plan.repository.PlanRepository;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import com.yongy.dotorimainservice.domain.planDetail.repository.PlanDetailRepository;
import com.yongy.dotorimainservice.domain.reward.entity.Reward;
import com.yongy.dotorimainservice.domain.reward.repository.RewardRepository;
import com.yongy.dotorimainservice.domain.user.entity.User;
import com.yongy.dotorimainservice.global.common.CallServer;
import com.yongy.dotorimainservice.global.common.PodoBankInfo;
import com.yongy.dotorimainservice.global.redis.entity.BankAccessToken;
import com.yongy.dotorimainservice.global.redis.repository.BankAccessTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final PlanDetailRepository planDetailRepository;
    private final CategoryGroupRepository categoryGroupRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final BankRepository bankRepository;
    private final BankAccessTokenRepository bankAccessTokenRepository;
    private final AccountService accountService;
    private final CallServer callServer;
    private final PodoBankInfo podoBankInfo;
    private final PaymentRepository paymentRepository;
    private final RewardRepository rewardRepository;
    @Value("${dotori.purpose.url}")
    private String PURPOSE_SERVICE_URL;
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public final ChatGPTService chatGPTService;

    @Override
    public void createPlan(PlanDTO planDTO) {
        User loginUser = this.getLoginUser();
        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime startTime = LocalDateTime.parse(planDTO.getStartedAt(), formatter);

        State state = State.READY;
        if(startTime.toLocalDate().equals(LocalDate.now())){
            state = State.ACTIVE;
        }

        // TODO : accoutSeq랑 User랑 일치하는지 확인
        Account account = accountRepository.findByUserSeqAndAccountSeqAndDeleteAtIsNull(loginUser.getUserSeq(), planDTO.getAccountSeq());
        if(account == null){
            throw new NotFoundAccountNumberException("계좌가 존재하지 않습니다.");
        }

        LocalDateTime start = LocalDateTime.parse(planDTO.getStartedAt(), formatter);
        start.withHour(0);
        start.withMinute(0);
        start.withSecond(0);
        start.withNano(0);

        LocalDateTime end = LocalDateTime.parse(planDTO.getEndAt(), formatter);
        end.withHour(0);
        end.withMinute(0);
        end.withSecond(0);
        end.withNano(0);

        Plan plan = planRepository.save(Plan.builder()
                .userSeq(loginUser.getUserSeq())
                .account(account)
                .startAt(start)
                .endAt(end)
                .planState(state)
                .updatedAt(LocalDateTime.parse(planDTO.getStartedAt(), formatter)) // 마지막 업데이트 날짜
                .totalSavings(BigDecimal.ZERO)
                .count(0L)
                .build());

        List<CategoryGroupListDTO> groupList = planDTO.getCategoryGroupList();
        CategoryGroup categoryGroup = null;
        for (CategoryGroupListDTO group : groupList) {
            categoryGroup = categoryGroupRepository.findByGroupTitleAndUserSeq(group.getCategoryGroupName(), loginUser.getUserSeq()); // categoryGroup이 없는 경우

            // 카테고리 그룹 만들기
            if(categoryGroup == null){
                categoryGroup = categoryGroupRepository.save(CategoryGroup.builder() // categoryGroup이 있는 경우
                        .userSeq(loginUser.getUserSeq())
                        .groupTitle(group.getCategoryGroupName()).build());
            }


            // 카테고리 만들기 +  Plan에 딸린 실행중인 카테고리인 PlanDetail 생성
            List<ActiveCategoryDTO> categorise = group.getCategories();
            log.info(categorise.isEmpty()+"");
            List<PlanDetail> planDetailList = new ArrayList<>();

            Category category = null;
            for (ActiveCategoryDTO data : categorise) {
                category = categoryRepository.findByCategoryTitleAndUserSeq(data.getCategoryName(), loginUser.getUserSeq()); // category가 있는 경우

                if(category == null){ // category가 없는 경우
                    category = categoryRepository.save(Category.builder()
                            .userSeq(loginUser.getUserSeq())
                            .categoryTitle(data.getCategoryName())
                            .build());
                }

                planDetailRepository.save(PlanDetail.builder()
                        .plan(plan)
                        .category(category)
                        .categoryGroup(categoryGroup)
                        .detailLimit(data.getTargetAmount())
                        .detailBalance(BigDecimal.ZERO)
                        .build());
            }
            planDetailRepository.saveAll(planDetailList);
        }
    }

    @Override
    @Transactional
    public void terminatePlan(Long planSeq) {
        // 계획 중단시 plan_state를 INACTIVE로 변경
        Plan plan = planRepository.findByPlanSeq(planSeq);

        if (plan.getPlanState() != State.ACTIVE) {
            throw new NotActivePlanException("진행 중인 계획이 아닙니다.");
        }

        plan.update(Plan.builder()
                .terminatedAt(LocalDateTime.now())
                .planState(State.INACTIVE)
                .build());
    }

    @Override
    public void updateState(Long planSeq) {
        Plan plan = planRepository.findByPlanSeq(planSeq);

        if(!plan.getPlanState().equals(State.ACTIVE)){
            throw new NotActivePlanException("진행 중인 계획이 아닙니다.");
        }

        planRepository.save(plan.updateState(State.COMPLETED));
    }


    @Override
    public void saving(SavingDTO savingDTO) throws ParseException {
        log.info(savingDTO.getPlanSeq()+"");
        log.info(savingDTO.toString());

        Plan plan = planRepository.findByPlanSeq(savingDTO.getPlanSeq());
        Account account = plan.getAccount();
        List<PlanDetail> planDetailList = planDetailRepository.findAllByPlanPlanSeq(savingDTO.getPlanSeq());
        BigDecimal totalSaving = new BigDecimal(BigInteger.ZERO);

        if(plan.getPlanState().equals(State.SAVED)){
            throw new IllegalArgumentException("저축 가능한 계획이 아닙니다.");
        }

        // 출금이 완료되면 금액 정보 갱신
        callBankAPI(account, savingDTO);

        for(PlanDetail planDetail : planDetailList){ // 전체 planDetail 저축액 구하기
            totalSaving = totalSaving.add(planDetail.getDetailBalance());
        }

        // 추가 저축액 저장
        planRepository.save(plan.updateAdditionalSaving(savingDTO.getTotalSaving().subtract(totalSaving)));

        HashMap<String, Object> data = new HashMap<>();
        data.put("accountSeq",plan.getAccount().getAccountSeq());
        data.put("savingDTO",(savingDTO));

        ResponseEntity<String> response = callServer.postHttpBodyAndSend(PURPOSE_SERVICE_URL+"/purpose/saving", data);
        if(!response.getStatusCode().equals(HttpStatusCode.valueOf(200))){
            throw new PurposeServiceFailedException("Purpose Service 호출 에러");
        }

        // 2. 계획 종료 표시하기
        planRepository.save(plan.finisedPlan(LocalDateTime.now()));

        // 3. 도토리 1개 얻기
        Reward reward = rewardRepository.findByUserSeq(plan.getUserSeq());
        reward = reward.plusDotori();

        if(reward.getDotori() == 10){ // 도토리가 10개가 되면 coin 1개 지급
            reward = reward.initDotori();
            reward = reward.plusCoin();
        }

        rewardRepository.save(reward);
    }

    public void callBankAPI(Account account, SavingDTO savingDTO) throws ParseException {
        Bank bankInfo = bankRepository.findByBankSeq(account.getBank().getBankSeq());
        log.info(bankInfo.getBankName());
        BankAccessToken bankAccessToken = bankAccessTokenRepository.findByBankName(bankInfo.getBankName()); // 은행 accessToken 가져오기
        String accessToken = null;

        if(bankAccessToken != null){ // accessToken이 없으면
            accessToken = bankAccessToken.getToken();
        }

        if(bankAccessToken == null){
            accessToken = podoBankInfo.getConnectionToken(bankInfo.getBankSeq());
        }
        // NOTE : plan에 연결된 계좌에서 총 금액을 도토리 계좌로 입금 요청하기
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");
        httpHeaders.add("Authorization","Bearer " + accessToken);

        Map<String, String> bodyData = new HashMap<>();
        bodyData.put("serviceCode", bankInfo.getServiceCode());
        bodyData.put("fintechCode", account.getFintechCode());
        bodyData.put("amount", savingDTO.getTotalSaving().toString());
        bodyData.put("content", "도토리 저축");

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bankInfo.getBankUrl()+"/api/v1/fintech/withdraw",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        String responseCode = response.getStatusCode().toString().split(" ")[0];
        if(!responseCode.equals("200")){
            throw new IllegalArgumentException("출금에 실패했습니다.");
        }
    }

    public List<PlanListDto> getPlanList(){
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // TODO :  null이 아닌 경우에서 Inactive를 제외한 모든 경우에 명세서를 출력함

        List<Plan> planList = planRepository.findAllByUserSeqAndTerminatedAtIsNotNull(user.getUserSeq()); // null이 아닌 경우

        List<PlanListDto> planListDtoList = new ArrayList<>();
        for(Plan plan : planList){
            if(!plan.getPlanState().equals(State.INACTIVE)){
                planListDtoList.add(PlanListDto.builder().planSeq(plan.getPlanSeq())
                        .accountTitle(accountRepository.findByUserSeqAndDeleteAtIsNull(user.getUserSeq()).getAccountTitle())
                        .startAt(plan.getStartAt().format(formatter))
                        .endAt(plan.getEndAt().format(formatter)).build());
            }
        }
        return planListDtoList;
    }



    @Override
    public ActivePlanDTO findAllPlan(Long accountSeq) throws IOException, ParseException {
         // 실행중인 계획 조회

        // Plan이 있는 지 확인, 실행중인 Plan인지 확인
        // 플랜이 있고, 실행중이면 : 로직 처리
        // 플랜이 있고, 시작 전인 플랜이 있으면
        // 플랜이 없으면 : 플랜 만들기 페이지
        Plan plan = checkActivePlan(accountSeq);
        if(plan != null) { // 보여줄 계획이 존재하면
            // 실행 중인 카테고리 가져오기
            List<PlanDetail> planDetailList = plan.getPlanDetailList();
            List<ActivePlanDetailDTO> activePlanList = new ArrayList<>();

            for (PlanDetail detail : planDetailList) {
                if (plan.getTerminatedAt() != null) { // 끝난 계획의 카테고리면 미분류 확인됨으로 바꿈
                    List<Payment> unclassified = paymentRepository.findAllByPlanDetailSeqAndChecked(detail.getPlanDetailSeq(), false);
                    List<Payment> checked = new ArrayList<>();
                    for (Payment p : unclassified) {
                        checked.add(p.updateChecked());
                    }
                    paymentRepository.saveAll(checked);
                }

                if (plan.getTerminatedAt() == null) {
                    PlanDetail planDetail = detail;
                    activePlanList.add(ActivePlanDetailDTO.builder()
                            .title(planDetail.getCategory().getCategoryTitle())
                            .groupTitle(planDetail.getCategoryGroup().getGroupTitle())
                            .goalAmount(planDetail.getDetailLimit())
                            .currentBalance(planDetail.getDetailBalance())
                            .planDetailSeq(detail.getPlanDetailSeq())
                            .build());
                }
            }

            ActivePlanDTO result = ActivePlanDTO.builder()
                    .accountBalance(accountService.getBalance(accountSeq))
                    .startedAt(plan.getStartAt())
                    .endAt(plan.getEndAt())
                    .state(plan.getPlanState())
                    .planSeq(plan.getPlanSeq())
                    .terminatedAt(plan.getTerminatedAt())
                    .unclassified(plan.getCount())
                    .activePlanList(activePlanList)
                    .build();

            return result;
        }
        return ActivePlanDTO.builder().accountBalance(accountService.getBalance(accountSeq)).build();
    }

    public Plan checkActivePlan(Long accountSeq){
        Plan plan = planRepository.findByAccountAccountSeqAndPlanStateAndTerminatedAtIsNull(accountSeq, State.ACTIVE);

        if(plan != null){
            return plan;
        }

        plan = planRepository.findByAccountAccountSeqAndPlanStateAndTerminatedAtIsNull(accountSeq, State.READY);
        if(plan != null){
            return plan;
        }

        plan = planRepository.findByAccountAccountSeqAndPlanStateAndTerminatedAtIsNotNull(accountSeq, State.ACTIVE);
        if(plan != null){
            throw new ExistTerminatedPlanException(plan.getPlanSeq().toString());
        }

        return null;
    }

    @Override
    public void removeUserPlans(Long userSeq){
        List<Plan> planList = planRepository.findAllByUserSeqAndTerminatedAtIsNull(userSeq);
        for(Plan plan : planList){
            plan.setPlanState(State.INACTIVE);
            plan.setEndAt(LocalDateTime.now());
        }
        planRepository.saveAll(planList);
    }

    public boolean checkTerminate(LocalDateTime endAt){
        if(endAt.isBefore(LocalDateTime.now())){
            return true;
        }
        return false;
    }

    public User getLoginUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }


    public Plan findByPlanSeq(Long planSeq){
        return planRepository.findByPlanSeq(planSeq);
    }

    // NOTE : 12시 되면 날짜 확인하고 실행
    //@Scheduled(cron = "* * * * * *") // 매일 자정에 실행
    public void startEndPlan() {
        // 모든 사용자의 모든 READY인 Plan 가져와서 ACTIVE로 변경하기
        LocalDateTime today = LocalDateTime.now();
        today.withHour(0);
        today.withMinute(0);
        today.withSecond(0);
        today.withNano(0);
        log.info(today.toString());

        // 시작 처리
        List<Plan> startplans = planRepository.findAllByStartAtAndPlanState(today, State.READY);
        List<Plan> startResult = new ArrayList<>();

        for (Plan p : startplans) {
            if (p.getStartAt().toLocalDate().equals(today)) {
                startResult.add(p.updateState(State.ACTIVE));
            }
        }
        planRepository.saveAll(startResult);

        // 종료 처리
        List<Plan> endPlans = planRepository.findAllByEndAtAndPlanState(today,State.ACTIVE);
        List<Plan> endResult = new ArrayList<>();

        for (Plan p : endPlans) {
            if (p.getEndAt().toLocalDate().equals(today)) {
                endResult.add(p.terminate(today));
            }
        }
        planRepository.saveAll(endResult);
    }
}