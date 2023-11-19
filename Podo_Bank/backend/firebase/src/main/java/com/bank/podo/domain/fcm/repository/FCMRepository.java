package com.bank.podo.domain.fcm.repository;

import com.bank.podo.domain.fcm.entity.FCMToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FCMRepository extends JpaRepository<FCMToken, Long> {
    void deleteByEmail(String email);

    Optional<FCMToken> findByEmail(String targetUserEmail);
}
