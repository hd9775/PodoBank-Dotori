package com.yongy.dotorimainservice.domain.reward.service;

import com.yongy.dotorimainservice.domain.reward.dto.DotoriDTO;
import com.yongy.dotorimainservice.domain.reward.dto.RandomBoxDTO;
import org.json.simple.parser.ParseException;

public interface RewardService {

    DotoriDTO getDotori();
    void createUserReward(Long userSeq);
    void randomBoxWithdraw(RandomBoxDTO randomBoxDTO) throws ParseException;
    void deleteUserReward(Long userSeq);
    int openRandomBox(Long coin);
}
