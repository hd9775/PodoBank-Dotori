package com.yongy.dotoripurposeservice.global.redis.repository;


import com.yongy.dotoripurposeservice.global.redis.entity.UserRefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRefreshTokenRepository extends CrudRepository<UserRefreshToken, String> {

    UserRefreshToken findByRefreshToken(String refreshToken);
}
