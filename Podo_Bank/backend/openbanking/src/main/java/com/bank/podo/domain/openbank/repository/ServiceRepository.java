package com.bank.podo.domain.openbank.repository;

import com.bank.podo.domain.openbank.entity.FintechService;
import com.bank.podo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<FintechService, Long> {
    Optional<FintechService> findByServiceCode(String serviceCode);

    Optional<FintechService> findByServiceCodeAndUser(String serviceCode, User user);

}
