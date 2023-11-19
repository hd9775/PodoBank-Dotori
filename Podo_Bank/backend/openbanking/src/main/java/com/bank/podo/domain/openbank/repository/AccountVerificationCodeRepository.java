package com.bank.podo.domain.openbank.repository;

import com.bank.podo.domain.openbank.entity.AccountVerificationCode;
import org.springframework.data.repository.CrudRepository;

public interface AccountVerificationCodeRepository extends CrudRepository<AccountVerificationCode, String> {
}
