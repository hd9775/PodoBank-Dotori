package com.bank.podo.domain.account.repository;

import com.bank.podo.domain.account.entity.Account;
import com.bank.podo.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByAccountNumberAndDeletedFalse(String generatedNumber);

    List<Account> findAllByUserAndDeletedFalse(User user);

    Optional<Account> findByAccountNumberAndDeletedFalse(String accountNumber);

    int countByUserAndDeletedFalse(User user);

    Account findByAccountNumber(String accountNumber);
}
