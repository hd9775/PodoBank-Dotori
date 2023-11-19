package com.bank.podo.domain.account.repository;

import com.bank.podo.domain.account.entity.Account;
import com.bank.podo.domain.account.entity.TransactionHistory;
import com.bank.podo.domain.account.enums.TransactionType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {

    List<TransactionHistory> findAllByAccountAndCreatedAtGreaterThanEqual(Account account, LocalDateTime createdAt);
    List<TransactionHistory> findAllByAccountAndCreatedAtGreaterThanEqual(Account account, LocalDateTime createdAt, PageRequest pageRequest);

    List<TransactionHistory> findAllByAccountAndTransactionType(Account account, TransactionType transactionType, PageRequest pageRequest);

    @Query("SELECT th.counterAccount " +
            "FROM TransactionHistory th " +
            "WHERE th.account = :account AND th.counterAccount IS NOT NULL " +
            "GROUP BY th.counterAccount " +
            "ORDER BY MAX(th.createdAt) DESC " +
            "LIMIT 3")
    List<Account> findThreeMostRecentUniqueAccounts(Account account);

    List<TransactionHistory> findAllByAccountAndTransactionTypeAndCreatedAtGreaterThanEqual(Account account, TransactionType transactionType, LocalDateTime createdAt, PageRequest pageRequest);

    List<TransactionHistory> findAllByAccountAccountNumberAndCreatedAtGreaterThanEqual(String accountNumber, LocalDateTime startAt);
}
