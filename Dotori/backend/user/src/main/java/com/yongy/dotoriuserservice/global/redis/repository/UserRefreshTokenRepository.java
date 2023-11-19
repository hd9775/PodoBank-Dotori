package com.yongy.dotoriuserservice.global.redis.repository;


import com.yongy.dotoriuserservice.global.redis.entity.UserRefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRefreshTokenRepository extends CrudRepository<UserRefreshToken, String> {

    UserRefreshToken findByRefreshToken(String refreshToken);
}
