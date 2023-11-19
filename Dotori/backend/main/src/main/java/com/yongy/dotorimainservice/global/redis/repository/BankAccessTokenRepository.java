package com.yongy.dotorimainservice.global.redis.repository;


import com.yongy.dotorimainservice.global.redis.entity.BankAccessToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankAccessTokenRepository extends CrudRepository<BankAccessToken, String> {
    BankAccessToken findByBankName(String bankName);

}
