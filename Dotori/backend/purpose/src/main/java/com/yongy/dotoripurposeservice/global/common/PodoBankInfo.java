package com.yongy.dotoripurposeservice.global.common;


import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.BankDTO;
import com.yongy.dotoripurposeservice.global.redis.entity.BankAccessToken;
import com.yongy.dotoripurposeservice.global.redis.entity.BankRefreshToken;
import com.yongy.dotoripurposeservice.global.redis.repository.BankAccessTokenRepository;
import com.yongy.dotoripurposeservice.global.redis.repository.BankRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PodoBankInfo {

    private final BankAccessTokenRepository bankAccessTokenRepository;
    private final BankRefreshTokenRepository bankRefreshTokenRepository;
    private final CallServer callServer;
//    private static Bank bank;
//    private final BankRepository bankRepository;

    public ResponseEntity<String> response;
    public final HashMap<String, Object> bodyData;


    // NOTE: 사용자의 access, refreshToken 가져오기
    public void podoBankLogin(BankDTO bank){
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json;charset=utf-8");

            Map<String, String> bodyData = new HashMap<>();
            bodyData.put("email", bank.getBankId());
            bodyData.put("password", bank.getBankPwd());

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, headers);

            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(
                    bank.getBankUrl()+"/api/v1/auth/login",
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

            bankAccessTokenRepository.save(BankAccessToken.of(bank.getBankName(), accessToken));
            bankRefreshTokenRepository.save(BankRefreshToken.of(bank.getBankName(), refreshToken));
        } catch (ParseException e) {
            throw new IllegalArgumentException("포도뱅크에 로그인할 수 없음");
        }
    }

    public void podoTokenUpdate(BankDTO bank, String refreshToken) throws ParseException {

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("refreshToken", refreshToken);

        log.info("RefreshToken : "+ refreshToken);

        log.info(bank.getBankUrl()+"/api/v1/auth/refresh");

        response = callServer.postHttpWithParamsAndSend(bank.getBankUrl()+"/api/v1/auth/refresh", parameters);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(response.getBody());

        String newAccessToken = (String) jsonObject.get("accessToken");
        String newRefreshToken = (String) jsonObject.get("refreshToken");

        log.info("1- newAccessToken : "+ newAccessToken);
        log.info("2- newRefreshToken : "+ newRefreshToken);

        bankAccessTokenRepository.save(BankAccessToken.of(bank.getBankName(), newAccessToken));
        bankRefreshTokenRepository.save(BankRefreshToken.of(bank.getBankName(), newRefreshToken));
    }


    // NOTE : accessToken이나 refreshToken을 세팅한다.(없으면 podoBankLogin을 호출해서 새로 발급해서 세팅함)
    public String getConnectionToken(BankDTO bank) throws ParseException {

        Optional<BankAccessToken> bankAccessToken = bankAccessTokenRepository.findById(bank.getBankName());

        Optional<BankRefreshToken> bankRefreshToken = bankRefreshTokenRepository.findById(bank.getBankName());

        String useToken = null;

        if(bankAccessToken.isEmpty()){
            if(bankRefreshToken.isEmpty()){
                log.info("--1--");
                this.podoBankLogin(bank); // refreshToken이 만료되었으므로 다시 로그인
            }else{
                log.info("--2--");
                try{
                    this.podoTokenUpdate(bank, bankRefreshToken.get().getToken()); // refreshToken으로 업데이트
                }catch(Exception e){
                    this.podoBankLogin(bank); // refreshToken이 만료되었으므로 다시 로그인
                }
            }
            useToken = bankAccessTokenRepository.findById(bank.getBankName()).get().getToken();
        }else{
            log.info("--3--");
            useToken = bankAccessToken.get().getToken();
        }
        return useToken;
    }
}
