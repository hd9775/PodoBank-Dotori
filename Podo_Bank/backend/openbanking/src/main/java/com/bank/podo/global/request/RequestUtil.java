package com.bank.podo.global.request;

import com.bank.podo.domain.openbank.dto.FintechTransferDTO;
import com.bank.podo.domain.openbank.dto.FintechUserBalanceDTO;
import com.bank.podo.domain.openbank.dto.TransactionHistoryDTO;
import com.bank.podo.domain.user.entity.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RequestUtil {

    @Value("${http.request.auth.url}")
    private String authUrl;

    @Value("${http.request.user.url}")
    private String userUrl;

    @Value("${http.request.account.url}")
    private String accountUrl;

    private final RequestApi requestApi;

    public User getUser(String email) {
        String url = userUrl + "/api/v1/user/userInfo";

        try {
            ObjectMapper objectMapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule());
            JsonNode jsonNode = requestApi.apiPostGetBody(url, email);
            if(jsonNode != null) {
                User user = objectMapper.readValue(jsonNode.toString(), User.class);
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return null;
    }

    public boolean transfer(FintechTransferDTO fintechTransferDTO) {
        String url = accountUrl + "/api/v1/account/admin/transfer";

        try {
            ObjectMapper objectMapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule());
            String json = objectMapper.writeValueAsString(fintechTransferDTO);
            return requestApi.apiPost(url, json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public FintechUserBalanceDTO getBalance(String accountNumber) {
        String url = accountUrl + "/api/v1/account/admin/balance";

        try {
            ObjectMapper objectMapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule());
            JsonNode request = objectMapper.createObjectNode()
                    .put("accountNumber", accountNumber);

            JsonNode jsonNode = requestApi.apiPostGetBody(url, objectMapper.writeValueAsString(request));
            if(jsonNode != null) {
                return objectMapper.readValue(jsonNode.toString(), FintechUserBalanceDTO.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<TransactionHistoryDTO> getHistory(String accountNumber, LocalDateTime startAt) {
        String url = accountUrl + "/api/v1/account/admin/history";

        try {
            ObjectMapper objectMapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule());
            JsonNode request = objectMapper.createObjectNode()
                    .put("accountNumber", accountNumber)
                    .put("startAt", startAt.toString());

            ArrayNode jsonNode = (ArrayNode) requestApi.apiPostGetBody(url, objectMapper.writeValueAsString(request));
            if(jsonNode != null) {
                return objectMapper.readValue(jsonNode.toString(), objectMapper.getTypeFactory().constructCollectionType(List.class, TransactionHistoryDTO.class));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
