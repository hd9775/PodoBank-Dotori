package com.yongy.dotorimainservice.domain.bank.repository;


import com.yongy.dotorimainservice.domain.bank.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {
    List<Bank> findAll();
    Bank findByBankSeq(Long bankSeq);
}
