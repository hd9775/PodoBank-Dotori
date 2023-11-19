package com.bank.podo.global.security.repository;

import com.bank.podo.global.security.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String> {

    RefreshToken findByRefreshToken(String refreshToken);

    void deleteByRefreshToken(String refreshToken);
}
