package com.yongy.dotorimainservice.domain.account.repository;

import com.yongy.dotorimainservice.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByAccountSeqAndDeleteAtIsNull(Long accountSeq);
    Account findByAccountNumberAndDeleteAtIsNull(String accountNumber);
    List<Account> findAllByUserSeqAndDeleteAtIsNull(Long userSeq);
    Account findByUserSeqAndDeleteAtIsNull(Long userSeq);

    Account findByUserSeqAndAccountNumberAndDeleteAtIsNull(Long userSeq, String accountNumber);

    Account findByUserSeqAndAccountSeqAndDeleteAtIsNull(Long userSeq, Long accountSeq);

}
