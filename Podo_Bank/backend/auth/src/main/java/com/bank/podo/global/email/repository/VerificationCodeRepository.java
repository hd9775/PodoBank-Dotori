package com.bank.podo.global.email.repository;

import com.bank.podo.global.email.entity.VerificationCode;
import org.springframework.data.repository.CrudRepository;

public interface VerificationCodeRepository extends CrudRepository<VerificationCode, String> {

}
