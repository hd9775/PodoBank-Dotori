package com.yongy.dotoriuserservice.global.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Call;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@AllArgsConstructor
public class CallServer {

    // NOTE : requestBody로 데이터 보낼 때
    public ResponseEntity<String> postHttpBodyAndSend(String url, HashMap<String, Object> bodyData){
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json;charset=utf-8");

        HttpEntity<HashMap<String, Object>> httpEntity = new HttpEntity<>(bodyData, headers);

        RestTemplate restTemplate = new RestTemplate();
        log.info("------START------");
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                httpEntity,
                String.class
        );
        log.info("------END------");
        return response;
    }

    // NOTE : parameter로 데이터 보낼 때(POST)
    public ResponseEntity<String> postHttpWithParamsAndSend(String url, MultiValueMap<String, String> parameters){

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.postForEntity(url, parameters, String.class);

        return response;
    }

    // NOTE : parameter로 데이터 보낼 때(GET)
    public ResponseEntity<String> getHttpWithParamsAndSend(String url, HttpMethod method, HashMap<String, Object> params){
        // URL 매개변수를 이용한 요청 URL 생성
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
        for (Map.Entry<String, Object> entity : params.entrySet()) {
            builder.queryParam(entity.getKey(), entity.getValue());
        }
        String finalUrl = builder.build().toUriString();
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                finalUrl,
                method,
                null,
                String.class
        );
        return response;
    }


}
