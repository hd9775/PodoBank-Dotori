package com.yongy.dotoriuserservice.domain.userAuth.service;

import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.BankDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountCodeDto;
import com.yongy.dotoriuserservice.domain.userAuth.dto.request.UserAccountDto;
import com.yongy.dotoriuserservice.global.redis.entity.BankAccessToken;
import com.yongy.dotoriuserservice.global.redis.entity.BankRefreshToken;
import com.yongy.dotoriuserservice.global.redis.entity.PersonalAuth;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

public interface UserAuthService {

    public PersonalAuth getPersonalAuth(String authCode);

    public void deletePersonalAuth(String email);

    public void emailCertification(String id);

    public void sendEmailCertification(String id, String authCode);

    public void podoBankLogin();

    public String getConnectionToken(Long bankSeq) throws ParseException;


    public String sendAccountAuthCode(UserAccountDto userAccountDto) throws ParseException;

    public ResponseEntity<Void>checkAccountAuthCode(UserAccountCodeDto userAccountCodeDto) throws ParseException;
}
