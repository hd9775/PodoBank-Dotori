package com.yongy.dotoripurposeservice.domain.user;

import com.yongy.dotoripurposeservice.domain.user.entity.Provider;
import com.yongy.dotoripurposeservice.domain.user.entity.Role;
import com.yongy.dotoripurposeservice.domain.user.entity.User;
import com.yongy.dotoripurposeservice.global.common.CallServer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class CallUser {
    private final CallServer callServer;

    private final HashMap<String, Object> bodyData;
    private ResponseEntity<String> response;

    @Value("${dotori.user.url}")
    private String USER_SERVICE_URL;

    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public User getUserDtoById(String id) throws ParseException {

        bodyData.clear();
        bodyData.put("id", id);

        response = callServer.postHttpBodyAndSend(USER_SERVICE_URL+"/user/communication/userById", HttpMethod.POST, bodyData);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(response.getBody());

        User user = User.builder()
                .userSeq(Long.parseLong(jsonObject.get("userSeq").toString()))
                .role(Role.valueOf(jsonObject.get("role").toString()))
                .id(id)
                .password((String)jsonObject.get("password"))
                .birthDate(LocalDate.parse((String)jsonObject.get("birthDate")))
                .userName((String)jsonObject.get("userName"))
                .phoneNumber((String)jsonObject.get("phoneNumber"))
                .authProvider(Provider.valueOf(jsonObject.get("authProvider").toString())).build();

        if((String)jsonObject.get("securityNumber") != null)
            user.setSecurityNumber((String)jsonObject.get("securityNumber"));

        return user;

    }



}
