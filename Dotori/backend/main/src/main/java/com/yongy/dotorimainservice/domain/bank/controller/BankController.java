package com.yongy.dotorimainservice.domain.bank.controller;


import com.yongy.dotorimainservice.domain.bank.dto.response.BankDto;
import com.yongy.dotorimainservice.domain.bank.dto.response.BankListDto;
import com.yongy.dotorimainservice.domain.bank.service.BankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bank")
public class BankController {

    @Autowired
    private BankService bankService;

    @GetMapping
    public ResponseEntity<List<BankListDto>> bankList(){
        return ResponseEntity.ok().body(bankService.BankList());
    }

    @GetMapping("/communication/bankInfo")
    public ResponseEntity<BankDto> getBankInfo(@RequestParam Long bankSeq){
        log.info("come - BANK");
        return ResponseEntity.ok(bankService.bankDtoFromBank(bankSeq));
    }

}
