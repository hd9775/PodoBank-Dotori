package com.bank.podo.domain.account.repository;

import com.bank.podo.domain.account.entity.AccountCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountCategoryRepository extends JpaRepository<AccountCategory, Long> {

}
