package com.yongy.dotorimainservice.domain.chatGPT.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.category.repository.CategoryRepository;
import com.yongy.dotorimainservice.domain.categoryData.entity.CategoryData;
import com.yongy.dotorimainservice.domain.categoryData.repository.CategoryDataRepository;
import com.yongy.dotorimainservice.domain.chatGPT.dto.*;
import com.yongy.dotorimainservice.domain.payment.dto.response.PaymentPodoResDto;
import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.payment.repository.PaymentRepository;
import com.yongy.dotorimainservice.domain.payment.service.PaymentService;
import com.yongy.dotorimainservice.domain.plan.dto.ActiveCategoryDTO;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.entity.State;
import com.yongy.dotorimainservice.domain.plan.repository.PlanRepository;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import com.yongy.dotorimainservice.domain.planDetail.repository.PlanDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatGPTService {
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final PlanRepository planRepository;
    private final CategoryDataRepository categoryDataRepository;
    private final CategoryRepository categoryRepository;
    private final PlanDetailRepository planDetailRepository;

    @Value("${chatGPT.api-key}")
    private String API_KEY;
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";


    public Map<String, Integer> map;

    /** [카테고리] - [카테고리 그룹] - 45
     * 1. 외식 10만원 - 식비
     * 2. 카페 3만원 - 식비
     * 3. 여가 5만원 - 나를 위한 투자
     * 4. 교통비 10만원 - 가타
     * 5. 장보기 5만원 - 생활비
     * 6. 운동 5만원 - 나를 위한 투자
     * 7. 기타 7만원- 기타
     * */

    /**
     * [목표] 유럽여행, 결혼, 내집마련
     * */

    public void initSetting(){
        map = new HashMap<>();

        // 식비
        map.put("요기요_위대한상상", 1);
        map.put("버거킹(인의점)", 1);
        map.put("육쌈냉면", 1);
        map.put("미소야인동점", 1);

        // 카페
        map.put("커피비치", 2);
        map.put("카페봉봉", 2);
        map.put("탐앤탐스구미인동점", 2);
        map.put("무인아이스크림할인점",2);

        // 여가
        map.put("비트코인동전노래방", 3);
        map.put("볼륨업피씨방", 3);
        map.put("(주)인터파크", 3);
        map.put("JDC면세점_공항", 3);
        map.put("올리브영구미인동점", 3);

        // 교통비
        map.put("티머니개인택시_0", 4);
        map.put("한국철도공사", 4);
        map.put("후불교통대금", 4);

        // 장보기
        map.put("플러스마트", 5);
        map.put("GS25진평베스트", 5);

        // 운동
        map.put("유니버시아드레포츠센터", 6);
        map.put("율핏", 6);
        map.put("크로스핏진평", 6);

        // 기타
        map.put("영남에너지서비스", 7);
        map.put("뉴스터디카페", 7);

    }



    public List<ResultDataDTO> getChatGPTResponse(CategoryDataDTO categoryDataDTO) throws Exception {

        HttpClient httpClient = HttpClients.createDefault();
        HttpPost request = new HttpPost(API_URL);

        // API 요청 헤더 설정
        request.setHeader("Authorization", "Bearer " + API_KEY);
        request.setHeader("Content-Type", "application/json");

        // 대화 메시지 구성
        ObjectMapper objectMapper = new ObjectMapper();

        // 들어온 객체에 따라 message 및 request 만들기
        RequestDTO requestDTO = createRequest(categoryDataDTO);

        // API 요청 본문 설정
        String requestBody = objectMapper.writeValueAsString(requestDTO);
        request.setEntity(new StringEntity(requestBody, "UTF-8"));

        // API 호출 및 응답 처리
        HttpResponse response = httpClient.execute(request);
        String responseContent = EntityUtils.toString(response.getEntity(),"UTF-8");

        ResponseDetailDTO responseDetailDTO = objectMapper.readValue(responseContent, ResponseDetailDTO.class);
        Message message = responseDetailDTO.getChoices().get(0).getMessage();

        objectMapper = new ObjectMapper();
        Map<String, List<ActiveCategoryDTO>> dataMap = objectMapper.readValue(message.getContent(), Map.class);

        List<ResultDataDTO> result = new ArrayList<>();
        for(Map.Entry<String, List<ActiveCategoryDTO>> entry : dataMap.entrySet()){
            result.add(ResultDataDTO.builder()
                    .categoryGroupName(entry.getKey())
                    .categories(entry.getValue())
                    .build());
        }

        return result;
    }

    // NOTE : ChatGPT에 요청할 Request 만드는 메소드
    public RequestDTO createRequest(Object object){
        List<Message> messageList = new ArrayList<>();

        if(object instanceof CategoryDataDTO){
            messageList.add(Message.builder().role("system").content("JSON result like {categoryGroup1:[{categoryName1, targetAmount1}, {categoryName2,targetAmount2}...], categoryGroup2:[{category3, targetAmount3} , {category4, targetAmount4}, ...], ...}").build());
            messageList.add(Message.builder().role("system").content("all categories must belong to one categoryGroup").build());
            messageList.add(Message.builder().role("user").content(object.toString()).build());
        }

        if(object instanceof UnclassifiedDataDTO){
            messageList.add(Message.builder().role("system").content("All element of payments must belong to one planDetails.").build());
            messageList.add(Message.builder().role("system").content("import java.util.List;\n" +
                    "\n" +
                    "@Builder\n" +
                    "@Getter\n" +
                    "@NoArgsConstructor\n" +
                    "@AllArgsConstructor\n" +
                    "public class UnclassifiedResponseDTO {\n" +
                    "    Long planDetailSeq;\n" +
                    "    List<Long> paymentSeqs;\n" +
                    "}").build());
            messageList.add(Message.builder().role("system").content("JSON result what List<UnclassifiedResponseDTO> type.").build());
            messageList.add(Message.builder().role("user").content(object.toString()).build());
            log.info(object.toString());
        }

        RequestDTO requestDTO = RequestDTO.builder()
                .model("gpt-3.5-turbo")
                .messages(messageList)
                .temperature(1.0)
                .maxTokens(256)
                .topP(1)
                .frequencyPenalty(0)
                .presencePenalty(0)
                .build();

        return requestDTO;
    }

    public void getPaymentChatGPTResponse(UnclassifiedDataDTO unclassifiedDataDTO) throws IOException {
        // 계좌에 연결된 planDetail에 연결된 category 리스트랑 payment 리스트에 있는 name이랑 분류
        HttpClient httpClient = HttpClients.createDefault();
        HttpPost request = new HttpPost(API_URL);

        // API 요청 헤더 설정
        request.setHeader("Authorization", "Bearer " + API_KEY);
        request.setHeader("Content-Type", "application/json");

        // 대화 메시지 구성
        ObjectMapper objectMapper = new ObjectMapper();

        // 들어온 객체에 따라 message 및 request 만들기
        RequestDTO requestDTO = createRequest(unclassifiedDataDTO);

        // API 요청 본문 설정
        String requestBody = objectMapper.writeValueAsString(requestDTO);
        request.setEntity(new StringEntity(requestBody, "UTF-8"));

        // API 호출 및 응답 처리
        HttpResponse response = httpClient.execute(request);
        String responseContent = EntityUtils.toString(response.getEntity(),"UTF-8");

        ResponseDetailDTO responseDetailDTO = objectMapper.readValue(responseContent, ResponseDetailDTO.class);
        Message message = responseDetailDTO.getChoices().get(0).getMessage();
        log.info("메세지\n"+message.getContent());

        objectMapper = new ObjectMapper();
        List<UnclassifiedResponseDTO> data = objectMapper.readValue(message.getContent(), new TypeReference<List<UnclassifiedResponseDTO>>() {});
        List<Payment> result = new ArrayList<>();

        log.info(data.size()+"");

        int count = 0;

        for(UnclassifiedResponseDTO temp : data){
            for(Long paymentSeq : temp.getPaymentSeqs()){
                Payment tempPayment = paymentRepository.findByPaymentSeq(paymentSeq);
                tempPayment.updatePlanDetail(temp.getPlanDetailSeq());
                result.add(tempPayment);
            }
            count += temp.getPaymentSeqs().size();
        }

        log.info("결제 내역 개수 : "+count);
        paymentRepository.saveAll(result);

    }


    // NOTE : 계획 1개의 결제내역을 가져온다
    public void getOnePayments(Plan plan) throws ParseException, IOException {

        this.initSetting();

        List<Plan> activePlanList = planRepository.findAllByPlanStateAndTerminatedAtIsNull(State.ACTIVE);
        List<PlanDetail> planDetails = planDetailRepository.findAllByPlanPlanSeq(plan.getPlanSeq());

        LocalDateTime currentTime = LocalDateTime.now(); // 현재시간
        log.info("현재 시간: {}", currentTime);

        // 해당 플랜에 연결된 결제 내역

        // 현재 찾으려는 시간이 업데이트한 시간보다 이전이다.
        if(currentTime.isBefore(plan.getUpdatedAt())){
            return;
        }

        log.info("1==>"+plan.getAccount().toString());
        List<PaymentPodoResDto> paymentResDto = paymentService.getPayments(plan.getUpdatedAt(),plan.getAccount().getAccountSeq());
        log.info("SIZE==>"+paymentResDto.size());
        List<Payment> chatGPT = new ArrayList<>();
        List<Payment> existPayment = new ArrayList<>();

        for(PaymentPodoResDto payment : paymentResDto){
            log.info("Title : "+payment.getContent()+"Code :"+payment.getCode());
            // 카테고리 데이터에 정보가 없으면 최초로 들어온 정보이므로 GPT 분류
            if(payment.getCode() == null){
                continue;
            }

            CategoryData categoryData = categoryDataRepository.findByDataCode(payment.getCode());
            log.info("사업자코드"+payment.getCode()+"planDetail사이즈!!!!!!"+planDetails.size());

            if(categoryData == null){

                log.info("FIND ===========================>  "+ payment.getContent()+"," +map.get(payment.getContent()));
                // TODO : 랜덤메소드
                log.info(payment.getContent());
                chatGPT.add(Payment.builder()
                        .paymentName(payment.getContent())
                        .paymentPrice(payment.getAmount())
                        .userSeq(plan.getUserSeq())
                        .checked(false)
                        .businessCode(payment.getCode())
                        .planDetailSeq(Long.parseLong(map.get(payment.getContent()).toString()))
                        .paymentDate(payment.getTransactionAt())
                        .build());
                continue;
            }

            // 카테고리 데이터가 이미 있어서 planDetail에 연결 돼있는지 확인 해야하면
            // 카테고리데이터에 연결된 카테고리로 planDetail 찾기
            Category category = categoryRepository.findByCategorySeq(categoryData.getCategory().getCategorySeq());
            PlanDetail planDetail = planDetailRepository.findByCategory(category);

            if(plan.equals(planDetail.getPlan())){ // 결제 내역을 가져온 플랜과 카테고리데이터에 연결된 카테고리에 연결된 플랜이 같으면
                // 해당 planDetail정보를 payment에 저장하고, checked는 false로 해서 payment 생성
                log.info("planDetail에 있음");
                existPayment.add(Payment.builder()
                        .paymentName(payment.getContent())
                        .paymentPrice(payment.getAmount())
                        .userSeq(plan.getUserSeq())
                        .planDetailSeq(planDetail.getPlanDetailSeq())
                        .checked(false)
                        .businessCode(payment.getCode())
                        .build());
                continue;
            }

            log.info("-----planDetail----"+planDetails.get(0).getPlanDetailSeq());
            chatGPT.add(Payment.builder()
                    .paymentName(payment.getContent())
                    .paymentPrice(payment.getAmount())
                    .userSeq(plan.getUserSeq())
                    .checked(false)
                    .planDetailSeq(planDetails.get(0).getPlanDetailSeq())
                    .businessCode(payment.getCode())
                    .build());
        }

        plan.setUpdatedAt(LocalDateTime.now());
        planRepository.save(plan);

        paymentRepository.saveAll(chatGPT); // chatGPT로 분류할 거 저장
        paymentRepository.saveAll(existPayment); // 이미 등록된 사업장인 payment 한 번에 저장
        planRepository.save(plan.updateCount((long) chatGPT.size())); // 미분류 개수 저장

//        // NOTE : chatGPT로 분류
//        List<PlanDetail> planDetails = planDetailRepository.findAllByPlanPlanSeq(plan.getPlanSeq());
//        this.getPaymentChatGPTResponse(UnclassifiedDataDTO.builder()
//                .planDetails(planDetails)
//                .payments(chatGPT)
//                .build());
    }



    // @Scheduled(fixedRate = 30 * 60 * 1000) // 30분(밀리초 단위)
    public void getPayments() throws ParseException, IOException {

        List<Plan> activePlanList = planRepository.findAllByPlanStateAndTerminatedAtIsNull(State.ACTIVE);

        LocalDateTime currentTime = LocalDateTime.now(); // 현재시간
        log.info("현재 시간: {}", currentTime);

        // 해당 플랜에 연결된 결제 내역
        for(Plan plan : activePlanList){
            // 현재 찾으려는 시간이 업데이트한 시간보다 이전이다.
            if(currentTime.isBefore(plan.getUpdatedAt())){
                continue;
            }

            log.info("1==>"+plan.getAccount().toString());
            List<PaymentPodoResDto> paymentResDto = paymentService.getPayments(plan.getUpdatedAt(),plan.getAccount().getAccountSeq());
            List<Payment> chatGPT = new ArrayList<>();
            List<Payment> existPayment = new ArrayList<>();

            for(PaymentPodoResDto payment : paymentResDto){
                log.info("Title : "+payment.getContent()+"Code :"+payment.getCode());
                // 카테고리 데이터에 정보가 없으면 최초로 들어온 정보이므로 GPT 분류
                if(payment.getCode() == null){
                    continue;
                }

                CategoryData categoryData = categoryDataRepository.findByDataCode(payment.getCode());
                log.info("사업자코드"+payment.getCode());

                if(categoryData == null){
                    log.info(payment.getContent());
                    chatGPT.add(Payment.builder()
                            .paymentName(payment.getContent())
                            .paymentPrice(payment.getAmount())
                            .userSeq(plan.getUserSeq())
                            .checked(false)
                            .businessCode(payment.getCode())
                            .paymentDate(payment.getTransactionAt())
                            .build());
                    continue;
                }

                // 카테고리 데이터가 이미 있어서 planDetail에 연결 돼있는지 확인 해야하면
                // 카테고리데이터에 연결된 카테고리로 planDetail 찾기
                Category category = categoryRepository.findByCategorySeq(categoryData.getCategory().getCategorySeq());
                PlanDetail planDetail = planDetailRepository.findByCategory(category);

                if(plan.getPlanSeq() == planDetail.getPlan().getPlanSeq()){ // 결제 내역을 가져온 플랜과 카테고리데이터에 연결된 카테고리에 연결된 플랜이 같으면
                    // 해당 planDetail정보를 payment에 저장하고, checked는 false로 해서 payment 생성
                    existPayment.add(Payment.builder()
                            .paymentName(payment.getContent())
                            .paymentPrice(payment.getAmount())
                            .userSeq(plan.getUserSeq())
                            .planDetailSeq(planDetail.getPlanDetailSeq())
                            .checked(false)
                            .businessCode(payment.getCode())
                            .build());
                    continue;
                }

                chatGPT.add(Payment.builder()
                        .paymentName(payment.getContent())
                        .paymentPrice(payment.getAmount())
                        .userSeq(plan.getUserSeq())
                        .checked(false)
                        .businessCode(payment.getCode())
                        .build());

                // 업데이트한 날짜 저장

                plan.setUpdatedAt(LocalDateTime.now());
                planRepository.save(plan);
            }

            paymentRepository.saveAll(chatGPT); // chatGPT로 분류할 거 저장
            paymentRepository.saveAll(existPayment); // 이미 등록된 사업장인 payment 한 번에 저장
            planRepository.save(plan.updateCount((long) chatGPT.size())); // 미분류 개수 저장

            // NOTE : chatGPT로 분류
            List<PlanDetail> planDetails = planDetailRepository.findAllByPlanPlanSeq(plan.getPlanSeq());
            this.getPaymentChatGPTResponse(UnclassifiedDataDTO.builder()
                    .planDetails(planDetails)
                    .payments(chatGPT)
                    .build());
        }
    }
}
