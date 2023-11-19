package com.yongy.dotorimainservice.domain.reward.service;

import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.account.repository.AccountRepository;
import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import com.yongy.dotorimainservice.domain.bank.repository.BankRepository;
import com.yongy.dotorimainservice.domain.plan.dto.SavingDTO;
import com.yongy.dotorimainservice.domain.reward.dto.DotoriDTO;
import com.yongy.dotorimainservice.domain.reward.dto.RandomBoxDTO;
import com.yongy.dotorimainservice.domain.reward.entity.Reward;
import com.yongy.dotorimainservice.domain.reward.exception.FailedRandomBoxException;
import com.yongy.dotorimainservice.domain.reward.exception.NotfoundRewardException;
import com.yongy.dotorimainservice.domain.reward.repository.RewardRepository;
import com.yongy.dotorimainservice.domain.user.entity.User;
import com.yongy.dotorimainservice.global.common.PodoBankInfo;
import com.yongy.dotorimainservice.global.redis.entity.BankAccessToken;
import com.yongy.dotorimainservice.global.redis.repository.BankAccessTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Slf4j
@Transactional
@Service
public class RewardServiceImpl implements RewardService{

    private final RewardRepository rewardRepository;
    private final AccountRepository accountRepository;
    private final BankRepository bankRepository;
    private final PodoBankInfo podoBankInfo;
    @Value("${randombox.weight.one}")
    private int COIN_WEIGHT_ONE;
    @Value("${randombox.weight.two}")
    private int COIN_WEIGHT_TWO;
    @Value("${randombox.weight.three}")
    private int COIN_WEIGHT_THREE;

    @Override
    public DotoriDTO getDotori() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reward reward = rewardRepository.findByUserSeq(user.getUserSeq());

        if(reward == null){
            throw new NotfoundRewardException("Reward 정보가 존재하지 않습니다.");
        }

        return DotoriDTO.builder().dotori(reward.getDotori()).coin(reward.getCoin()).build();
    }

    // NOTE : 리워드 생성하기
    public void createUserReward(Long userSeq){
        Reward reward = Reward.builder()
                .userSeq(userSeq)
                .dotori(0L)
                .coin(0L).build();
        rewardRepository.save(reward);
    }

    @Override
    public void randomBoxWithdraw(RandomBoxDTO randomBoxDTO) throws ParseException {
        // TODO : 해당 계좌에 해당 금액만큼 송금
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Account account = accountRepository.findByUserSeqAndAccountSeqAndDeleteAtIsNull(user.getUserSeq(), randomBoxDTO.getAccountSeq());

        log.info("송금");
        this.callBankAPI(account, randomBoxDTO.getAmount());
    }

    public void callBankAPI(Account account, BigDecimal amount) throws ParseException {
        Bank bankInfo = bankRepository.findByBankSeq(account.getBank().getBankSeq());
        String bankAccessToken = podoBankInfo.getConnectionToken(bankInfo.getBankSeq());

        // NOTE : plan에 연결된 계좌에서 총 금액을 도토리 계좌로 입금 요청하기
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");
        httpHeaders.add("Authorization","Bearer " + bankAccessToken);

        Map<String, String> bodyData = new HashMap<>();
        bodyData.put("serviceCode", bankInfo.getServiceCode());
        bodyData.put("fintechCode", account.getFintechCode());
        bodyData.put("amount", amount.toString());
        bodyData.put("content", "도토리 깜짝상자");

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(bodyData, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(
                bankInfo.getBankUrl()+"/api/v1/fintech/deposit",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        String responseCode = response.getStatusCode().toString().split(" ")[0];
        if(!responseCode.equals("200")){
            throw new IllegalArgumentException("송금에 실패했습니다.");
        }
    }

    // NOTE : 리워드 삭제하기
    public void deleteUserReward(Long userSeq){
        rewardRepository.deleteByUserSeq(userSeq);
    }

    @Override
    public int openRandomBox(Long coin) {
        // TODO : 코인개수 차감하고 해당 개수당 금액 적용한 랜덤값 보내기
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Reward reward = rewardRepository.findByUserSeq(user.getUserSeq());
        Random random = new Random();
        int amount = 0;

        if(reward.getCoin() < coin){
            throw new FailedRandomBoxException("코인이 부족합니다.");
        }

        if(coin == 1){
            amount = (int)(random.nextDouble() * COIN_WEIGHT_ONE + 1);
        }

        if(coin == 2){
            amount = (int)(random.nextDouble() * COIN_WEIGHT_TWO + 1);
        }

        if(coin == 3){
            amount = (int)(random.nextDouble() * COIN_WEIGHT_THREE + 1);
        }

        rewardRepository.save(reward.updateCoin(coin));

        return amount;
    }
}
