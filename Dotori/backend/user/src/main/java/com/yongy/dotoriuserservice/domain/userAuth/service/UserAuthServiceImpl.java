package com.yongy.dotoriuserservice.domain.userAuth.service;




import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.BankDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountCodeDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountDto;
import com.yongy.dotoriuserservice.global.common.CallServer;
import com.yongy.dotoriuserservice.global.email.EmailUtil;
import com.yongy.dotoriuserservice.global.redis.entity.BankAccessToken;
import com.yongy.dotoriuserservice.global.redis.entity.BankRefreshToken;
import com.yongy.dotoriuserservice.global.redis.entity.PersonalAuth;
import com.yongy.dotoriuserservice.global.redis.repository.BankAccessTokenRepository;
import com.yongy.dotoriuserservice.global.redis.repository.BankRefreshTokenRepository;
import com.yongy.dotoriuserservice.global.redis.repository.PersonalAuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserAuthServiceImpl implements UserAuthService{
    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private PersonalAuthRepository personalAuthRepository;

    @Autowired
    private BankAccessTokenRepository bankAccessTokenRepository;

    @Autowired
    private BankRefreshTokenRepository bankRefreshTokenRepository;

    @Autowired
    private CallServer callServer;

    @Value("${dotori.main.url}")
    private String MAIN_SERVICE_URL;

    private static BankDto bankInfo;

    public final HashMap<String, Object> bodyData;

    public ResponseEntity<String> response;

    // NOTE : PersonalAuth 반환
    public PersonalAuth getPersonalAuth(String authCode) {
        return personalAuthRepository.findByAuthCode(authCode);
    }

    // NOTE : PersonalAuth 삭제
    public void deletePersonalAuth(String email){
        personalAuthRepository.deleteById(email);
    }

    // NOTE : [본인인증]이메일 인증코드를 생성한다.
    public void emailCertification(String id){
        Random random = new Random();
        String authCode = String.valueOf(random.nextInt(888888) + 111111); // 11111 ~ 99999의 랜덤한 숫자
        sendEmailCertification(id, authCode);
    }

    // NOTE : [본인인증]인증코드를 사용자 이메일로 전송한다.
    public void sendEmailCertification(String id, String authCode){
        emailUtil.setSubject("도토리 1원인증 코드");
        emailUtil.setPrefix("1원인증을 위한 인증번호는 ");
        emailUtil.sendEmailAuthCode(id, authCode);
        personalAuthRepository.save(PersonalAuth.of(id, authCode));
    }


    // NOTE: 사용자의 access, refreshToken 가져오기
    public void podoBankLogin(){
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json;charset=utf-8");

            Map<String, String> bodyData = new HashMap<>();
            bodyData.put("email", bankInfo.getBankId());
            bodyData.put("password", bankInfo.getBankPwd());

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, headers);

            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(
                    bankInfo.getBankUrl()+"/api/v1/auth/login",
                    HttpMethod.POST,
                    httpEntity,
                    String.class
            );

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(response.getBody());

            String accessToken = (String) jsonObject.get("accessToken");
            String refreshToken = (String) jsonObject.get("refreshToken");

            log.info("1- accessToken : "+ accessToken);
            log.info("2- refreshToken : "+ refreshToken);

            bankAccessTokenRepository.save(BankAccessToken.of(bankInfo.getBankName(), accessToken));
            bankRefreshTokenRepository.save(BankRefreshToken.of(bankInfo.getBankName(), refreshToken));
        } catch (ParseException e) {
            throw new IllegalArgumentException("포도뱅크에 로그인할 수 없음");
        }
    }

    public void podoTokenUpdate(String refreshToken) throws ParseException {

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("refreshToken", refreshToken);

        response = callServer.postHttpWithParamsAndSend(bankInfo.getBankUrl()+"/api/v1/auth/refresh", parameters);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(response.getBody());

        String newAccessToken = (String) jsonObject.get("accessToken");
        String newRefreshToken = (String) jsonObject.get("refreshToken");

        log.info("1- newAccessToken : "+ newAccessToken);
        log.info("2- newRefreshToken : "+ newRefreshToken);

        bankAccessTokenRepository.save(BankAccessToken.of(bankInfo.getBankName(), newAccessToken));
        bankRefreshTokenRepository.save(BankRefreshToken.of(bankInfo.getBankName(), newRefreshToken));
    }

    // NOTE : accessToken이나 refreshToken을 세팅한다.(없으면 podoBankLogin을 호출해서 새로 발급해서 세팅함)
    public String getConnectionToken(Long bankSeq) throws ParseException {
        bodyData.clear();
        bodyData.put("bankSeq", bankSeq);

        response = callServer.getHttpWithParamsAndSend(MAIN_SERVICE_URL+"/bank/communication/bankInfo",  HttpMethod.GET, bodyData);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject)jsonParser.parse(response.getBody());

        bankInfo = BankDto.builder()
                        .bankSeq(bankSeq)
                        .bankName(String.valueOf(jsonObject.get("bankName")))
                        .bankUrl(String.valueOf(jsonObject.get("bankUrl")))
                        .bankId(String.valueOf(jsonObject.get("bankId")))
                        .bankPwd(String.valueOf(jsonObject.get("bankPwd")))
                        .serviceCode(String.valueOf(jsonObject.get("serviceCode"))).build();


        Optional<BankAccessToken> bankAccessToken = bankAccessTokenRepository.findById(bankInfo.getBankName());

        Optional<BankRefreshToken> bankRefreshToken = bankRefreshTokenRepository.findById(bankInfo.getBankName());

        String useToken = null;

        if(bankAccessToken.isEmpty()){
            if(bankRefreshToken.isEmpty()){
                log.info("--1--");
                this.podoBankLogin(); // refreshToken이 만료되었으므로 다시 로그인
            }else{
                log.info("--2--");
                try{
                    this.podoTokenUpdate(bankRefreshToken.get().getToken()); // refreshToken으로 업데이트
                }catch(Exception e){
                    this.podoBankLogin(); // refreshToken이 만료되었으므로 다시 로그인
                }
            }
            useToken = bankAccessTokenRepository.findById(bankInfo.getBankName()).get().getToken();
        }else{
            log.info("--3--");
            useToken = bankAccessToken.get().getToken();
        }
        return useToken;
    }


    public String sendAccountAuthCode(UserAccountDto userAccountDto) throws ParseException {
        String useToken = this.getConnectionToken(userAccountDto.getBankSeq());

        log.info("useToken : "+ useToken);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + useToken);
        headers.add("Content-Type", "application/json;charset=utf-8");

        Map<String, String> bodyData = new HashMap<>();
        bodyData.put("serviceCode", bankInfo.getServiceCode());
        bodyData.put("accountNumber", userAccountDto.getAccountNumber());

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bankInfo.getBankUrl() + "/api/v1/fintech/oneCentVerification",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        String responseCode = response.getStatusCode().toString().split(" ")[0]; // 200

        return responseCode;
    }

    // NOTE : 1원 인증의 인증코드를 전송함
    public ResponseEntity<Void>checkAccountAuthCode(UserAccountCodeDto userAccountCodeDto) throws ParseException {
        String useToken = this.getConnectionToken(userAccountCodeDto.getBankSeq());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + useToken);
        headers.add("Content-Type", "application/json;charset=utf-8");

        bodyData.clear();
        bodyData.put("serviceCode", bankInfo.getServiceCode());
        bodyData.put("accountNumber", userAccountCodeDto.getAccountNumber());
        bodyData.put("verificationCode", "도토리"+userAccountCodeDto.getVerificationCode());

        HttpEntity<HashMap<String, Object>> httpEntity = new HttpEntity<>(bodyData, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bankInfo.getBankUrl() + "/api/v1/fintech/oneCentVerification/check",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        String responseCode = response.getStatusCode().toString().split(" ")[0];

        if(responseCode.equals("200")){
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject)jsonParser.parse(response.getBody());

            String fintechCode = jsonObject.get("fintechCode").toString();

            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            bodyData.clear();
            bodyData.put("accountNumber", userAccountCodeDto.getAccountNumber());
            bodyData.put("userSeq", user.getUserSeq());
            bodyData.put("bankSeq", bankInfo.getBankSeq());
            bodyData.put("fintechCode", fintechCode);

            response = callServer.postHttpBodyAndSend(MAIN_SERVICE_URL+"/account/communication/save", bodyData);

            return ResponseEntity.ok().build();
        }
        throw new IllegalArgumentException("1원 인증 실패");
    }
}
