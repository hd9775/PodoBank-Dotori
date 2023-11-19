package com.yongy.dotorimainservice.domain.account.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yongy.dotorimainservice.domain.account.dto.AccountDto;
import com.yongy.dotorimainservice.domain.account.dto.AccountListDto;
import com.yongy.dotorimainservice.domain.account.dto.BodyDataDTO;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountFintechCodeDTO;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountInfoDTO;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountNumberTitleReqDto;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountReqDto;
import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.account.repository.AccountRepository;
import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import com.yongy.dotorimainservice.domain.bank.repository.BankRepository;

import com.yongy.dotorimainservice.domain.bank.service.BankService;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import com.yongy.dotorimainservice.domain.plan.service.PlanService;
import com.yongy.dotorimainservice.domain.user.entity.User;
import com.yongy.dotorimainservice.global.common.PodoBankInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class AccountServiceImpl implements AccountService{
    private final BankRepository bankRepository;
    private final AccountRepository accountRepository;
    private final HashMap<String, Object> bodyData;
    private final PodoBankInfo podoBankInfo;


    @Override
    public List<AccountListDto> findAllAccount() throws JsonProcessingException, ParseException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("ID : "+user.getId());
        List<Account> accounts = accountRepository.findAllByUserSeqAndDeleteAtIsNull(user.getUserSeq());
        List<AccountListDto> result = new ArrayList<>();

        for(Account account : accounts){
            result.add(AccountListDto.builder()
                    .accountSeq(account.getAccountSeq())
                    .accountTitle(account.getAccountTitle())
                    .currentBalance(this.getBalance(account.getAccountSeq()))
                    .build());
        }

        return result;

    }

    @Override
    public BigDecimal getBalance(Long accountSeq) throws JsonProcessingException, ParseException {
        Account account = accountRepository.findByAccountSeqAndDeleteAtIsNull(accountSeq);
        Bank bankInfo = bankRepository.findByBankSeq(account.getBank().getBankSeq());

        String accessToken = podoBankInfo.getConnectionToken(bankInfo.getBankSeq()); // 은행 accessToken 가져오기


        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");

        httpHeaders.add("Authorization","Bearer " + accessToken);

        Map<String, String> bodyData = new HashMap<>();
        bodyData.put("serviceCode", bankInfo.getServiceCode());
        bodyData.put("fintechCode", account.getFintechCode());

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bankInfo.getBankUrl()+"/api/v1/fintech/balance",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        String responseCode = response.getStatusCode().toString().split(" ")[0];
        String responseContent = response.getBody();

        if(responseCode.equals("200")){
            ObjectMapper objectMapper = new ObjectMapper();
            BodyDataDTO data = objectMapper.readValue(responseContent,BodyDataDTO.class);
            return data.getBalance();
        }

        throw new IllegalArgumentException("계좌 정보를 불러오는데 실패했습니다.");
    }

    // NOTE : 포도은행 호출해서 삭제하기
    public void podoBankRemoveAccount(Account account) throws ParseException {
        Bank bank = account.getBank();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + podoBankInfo.getConnectionToken(bank.getBankSeq()));
        headers.add("Content-Type", "application/json;charset=utf-8");

        bodyData.clear();
        bodyData.put("serviceCode", bank.getServiceCode());
        bodyData.put("fintechCode", account.getFintechCode());

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(bodyData, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bank.getBankUrl() + "/api/v1/fintech/delete",
                HttpMethod.POST,
                httpEntity,
                String.class
        );
        log.info("Delete state : "+ response.getBody());
    }


    // NOTE : 사용자의 계좌 1개 삭제하기
    public void removeUserAccount(Long accountSeq) throws ParseException {
        Account account = accountRepository.findByAccountSeqAndDeleteAtIsNull(accountSeq);

        podoBankRemoveAccount(account); // 포도은행에서 계좌를 삭제함

        account.setDeleteAt(LocalDateTime.now()); // 도토리에서 계좌를 삭제함
        accountRepository.save(account);
    }

    @Override
    public AccountFintechCodeDTO getFintechCode(Long userSeq, AccountInfoDTO accountInfoDTO) {
//        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account account = accountRepository.findByUserSeqAndAccountNumberAndDeleteAtIsNull(userSeq, accountInfoDTO.getAccountNumber());
        return AccountFintechCodeDTO.builder().fintechCode(account.getFintechCode()).build();
    }

    // NOTE : 사용자의 계좌 모두 삭제하기
    public void removeUserAllAccounts(Long userSeq) throws ParseException {
        List<Account> accountList = accountRepository.findAllByUserSeqAndDeleteAtIsNull(userSeq);
        Bank bank = null;
        for(Account account : accountList){
            bank = account.getBank();
            podoBankRemoveAccount(account); // 포도은행에서 계좌를 삭제함
            account.setDeleteAt(LocalDateTime.now()); // 종료날짜
        }
        accountRepository.saveAll(accountList); // 도토리에서 계좌를 삭제함
    }

    // NOTE : 존재하는 계좌번호인지 확인하기
    public Account getUserAccount(String accountNumber){
        return accountRepository.findByAccountNumberAndDeleteAtIsNull(accountNumber);
    }

    // NOTE : 계좌 등록하기
    public void saveAccount(AccountReqDto accountReqDto){
        Account account = Account.builder()
                .accountNumber(accountReqDto.getAccountNumber())
                .userSeq(accountReqDto.getUserSeq())
                .bank(bankRepository.findByBankSeq(accountReqDto.getBankSeq()))
                .fintechCode(accountReqDto.getFintechCode()).build();
        accountRepository.save(account);
    }

    // NOTE : 계좌의 이름 설정하기
    public void saveAccountTitle(AccountNumberTitleReqDto accountNumberTitleReqDto){
        Account account = accountRepository.findByAccountNumberAndDeleteAtIsNull(accountNumberTitleReqDto.getAccountNumber());
        account.setAccountTitle(accountNumberTitleReqDto.getAccountTitle());
        accountRepository.save(account);
    }

    // NOTE : 1개의 계좌 조회하기(관리페이지)
    public AccountDto findAccount(Plan plan) throws ParseException, JsonProcessingException {
        Account account = accountRepository.findByAccountSeqAndDeleteAtIsNull(plan.getAccount().getAccountSeq());

        return AccountDto.builder()
                .bankName(account.getBank().getBankName())
                .accountNumber(account.getAccountNumber())
                .accountBalance(this.getBalance(account.getAccountSeq())).build();
    }


}
