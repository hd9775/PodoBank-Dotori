package com.yongy.dotoriAuthService.global.redis.repository;


import com.yongy.dotoriAuthService.global.redis.entity.UserRefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface UserRefreshTokenRepository extends CrudRepository<UserRefreshToken, String> {

    UserRefreshToken findByRefreshToken(String refreshToken);
}
