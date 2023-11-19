package com.yongy.dotoriuserservice.global.redis.repository;

import com.yongy.dotoriuserservice.global.redis.entity.BankRefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankRefreshTokenRepository extends CrudRepository<BankRefreshToken, String> {
    BankRefreshToken findByBankName(String bankName);

}
