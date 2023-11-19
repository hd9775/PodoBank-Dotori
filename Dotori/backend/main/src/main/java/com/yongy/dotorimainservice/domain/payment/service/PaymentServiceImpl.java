package com.yongy.dotorimainservice.domain.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.account.repository.AccountRepository;
import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import com.yongy.dotorimainservice.domain.bank.repository.BankRepository;
import com.yongy.dotorimainservice.domain.categoryData.entity.CategoryData;
import com.yongy.dotorimainservice.domain.categoryData.repository.CategoryDataRepository;
import com.yongy.dotorimainservice.domain.payment.dto.PaymentDetailDTO;
import com.yongy.dotorimainservice.domain.payment.dto.TransactionHistoryDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UnclassifiedDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UpdateDataDTO;
import com.yongy.dotorimainservice.domain.payment.dto.response.PaymentPodoResDto;
import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.payment.repository.PaymentRepository;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import com.yongy.dotorimainservice.domain.plan.repository.PlanRepository;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import com.yongy.dotorimainservice.domain.planDetail.repository.PlanDetailRepository;
import com.yongy.dotorimainservice.global.common.PodoBankInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService{

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private PodoBankInfo podoBankInfo;
    private final PlanDetailRepository planDetailRepository;
    private final CategoryDataRepository categoryDataRepository;
    private final PlanRepository planRepository;

    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // NOTE : 시작날짜, 계좌seq
    public List<PaymentPodoResDto> getPayments(LocalDateTime updateTime, Long accountSeq) throws ParseException, JsonProcessingException {
        Account account = accountRepository.findByAccountSeqAndDeleteAtIsNull(accountSeq);
        if(account == null){
            return new ArrayList<>();
        }
        Bank bank = bankRepository.findByBankSeq(account.getBank().getBankSeq());

        String useToken = podoBankInfo.getConnectionToken(bank.getBankSeq());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json;charset=utf-8");
        headers.add("Authorization", "Bearer " + useToken);

        HashMap<String, String> bodyData = new HashMap<>();
        bodyData.put("serviceCode",bank.getServiceCode());
        bodyData.put("fintechCode",account.getFintechCode());
        bodyData.put("startAt", updateTime.toString());

        HttpEntity<HashMap<String, String>> httpEntity = new HttpEntity<>(bodyData, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bank.getBankUrl()+"/api/v1/fintech/history",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        List<PaymentPodoResDto> paymentList = new ArrayList<>();
        log.info("state : "+ response.getStatusCode().toString().split(" ")[0]);

        if(response.getStatusCode().toString().split(" ")[0].equals("200")){
            JSONParser jsonParser = new JSONParser();
            JSONArray jsonArray = (JSONArray) jsonParser.parse(response.getBody());

            ObjectMapper objectMapper = new ObjectMapper();
            List<TransactionHistoryDTO> payments = objectMapper.registerModule(new JavaTimeModule()).readValue(jsonArray.toString(), objectMapper.getTypeFactory().constructCollectionType(List.class, TransactionHistoryDTO.class));
            payments = payments.stream().filter(TransactionHistoryDTO -> TransactionHistoryDTO.getTransactionType().equals("WITHDRAWAL")).toList();

            return payments.stream()
                    .map(transactionHistoryDTO -> PaymentPodoResDto.builder()
                            .transactionAt(transactionHistoryDTO.getTransactionAt())
                            .amount(transactionHistoryDTO.getAmount())
                            .balanceAfter(transactionHistoryDTO.getBalanceAfter())
                            .content(transactionHistoryDTO.getContent())
                            .code(transactionHistoryDTO.getBusinessCode()) // 사업자 코드를 설정해야 합니다.
                            .build())
                    .collect(Collectors.toList());

        }

        return paymentList;
    }

    @Override
    public List<PaymentDetailDTO> findAllUnclassified(Long planSeq) {

        // TODO : planSeq에 연결된 planDetail들에 연결된 payment 중에 checked가 false인 것 가져오기
        List<PlanDetail> planDetails = planDetailRepository.findAllByPlanPlanSeq(planSeq);
        List<Payment> unclassifiedData = new ArrayList<>();

        for(PlanDetail planDetail : planDetails){
            unclassifiedData.addAll(paymentRepository.findAllByPlanDetailSeqAndChecked(planDetail.getPlanDetailSeq(), false));
        }

        // 반환할 데이터 형식으로 변환
        List<PaymentDetailDTO> result = new ArrayList<>();
        for(Payment payment : unclassifiedData){
            PlanDetail planDetail = planDetailRepository.findByPlanDetailSeq(payment.getPlanDetailSeq());
            result.add(PaymentDetailDTO.builder()
                            .planDetailSeq(payment.getPlanDetailSeq())
                            .categoryName(planDetail.getCategory().getCategoryTitle())
                            .paymentSeq(payment.getPaymentSeq())
                            .paymentName(payment.getPaymentName())
                            .paymentPrice(payment.getPaymentPrice())
                            .paymentDate(payment.getPaymentDate().format(formatter))
                    .build());
        }
        return result;
    }

    @Override
    public void updateUnclassified(Long planSeq, UnclassifiedDTO updateUnclassifiedDTO) {
        Plan plan = planRepository.findByPlanSeq(planSeq);
        List<Payment> result = new ArrayList<>();
        Set<CategoryData> categoryDataSet = new HashSet<>(); // 저장할 CategoryData

        log.info("시작");
        // TODO : plan에 딸린 planDetail에 딸린 payment중 checked가 false인 것
        List<PlanDetail> planDetails = planDetailRepository.findAllByPlanPlanSeq(planSeq);
        for(PlanDetail planDetail : planDetails){
            List<Payment> list = paymentRepository.findAllByPlanDetailSeqAndChecked(planDetail.getPlanDetailSeq(), false);
            log.info("payment개수" + list.size());

            for(Payment payment : list){
                log.info(payment.toString());
                result.add(payment.updateChecked());

                CategoryData categoryData = categoryDataRepository.findByDataCode(payment.getBusinessCode());
                planDetailRepository.save(planDetail.updateBalance(payment.getPaymentPrice()));

                if(categoryData == null){ // 이전에 저장된 데이터가 없으면
                    categoryDataSet.add(CategoryData.builder()
                            .category(planDetail.getCategory())
                            .dataName(payment.getPaymentName())
                            .dataCode(payment.getBusinessCode())
                            .count(1) // 한 번 결제된 사용처니까 1로 초기화
                            .build());
                    continue;
                }
                // 이전에 저장된 데이터가 있음
                // TODO : payment 저장할 때마다 categoryData count++
                categoryDataSet.add(categoryData.updateCount());
            }


        }
        plan.setCount(0L);
        planRepository.save(plan.updateCount(0L)); // 모든 데이터 처리 했으니까
        paymentRepository.saveAll(result);
        categoryDataRepository.saveAll(categoryDataSet);

    }
}
