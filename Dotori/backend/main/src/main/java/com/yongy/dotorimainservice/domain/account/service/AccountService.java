package com.yongy.dotorimainservice.domain.account.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.account.dto.AccountDto;
import com.yongy.dotorimainservice.domain.account.dto.AccountListDto;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountFintechCodeDTO;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountInfoDTO;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountNumberTitleReqDto;
import com.yongy.dotorimainservice.domain.account.dto.communication.AccountReqDto;
import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.plan.entity.Plan;
import org.json.simple.parser.ParseException;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {
    List<AccountListDto> findAllAccount() throws JsonProcessingException, ParseException;
    void removeUserAllAccounts(Long userSeq) throws ParseException;
    Account getUserAccount(String accountNumber);

    void saveAccountTitle(AccountNumberTitleReqDto accountNumberTitleReqDto);

    void saveAccount(AccountReqDto accountReqDto);
    BigDecimal getBalance(Long accountSeq) throws JsonProcessingException, ParseException;

    void removeUserAccount(Long accountSeq) throws ParseException;
    AccountFintechCodeDTO getFintechCode(Long userSeq, AccountInfoDTO accountInfoDTO);

    AccountDto findAccount(Plan plan) throws ParseException, JsonProcessingException;



}
