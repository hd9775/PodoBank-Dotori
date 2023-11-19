package com.yongy.dotorimainservice.domain.bank.service;


import com.yongy.dotorimainservice.domain.bank.dto.response.BankDto;
import com.yongy.dotorimainservice.domain.bank.dto.response.BankListDto;

import java.util.List;

public interface BankService {
    public List<BankListDto> BankList();
    public BankDto bankDtoFromBank(Long bankSeq);
}
