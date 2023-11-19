package com.yongy.dotorimainservice.domain.reward.repository;

import com.yongy.dotorimainservice.domain.reward.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    Reward findByUserSeq(Long userSeq);

    void deleteByUserSeq(Long userSeq);
}
