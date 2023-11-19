package com.bank.podo.domain.openbank.repository;

import com.bank.podo.domain.openbank.entity.FintechService;
import com.bank.podo.domain.openbank.entity.FintechUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FintechUserRepository extends JpaRepository<FintechUser, Long> {
    Optional<FintechUser> findByFintechServiceAndFintechCode(FintechService fintechService, String fintechCode);

    Optional<Object> findByFintechServiceAndAccountNumber(FintechService fintechService, String accountNumber);
}
