package com.yongy.dotoripurposeservice.global.redis.repository;

import com.yongy.dotoripurposeservice.global.redis.entity.PersonalAuth;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalAuthRepository extends CrudRepository<PersonalAuth, String> {

    PersonalAuth findByAuthCode(String authCode);

}
