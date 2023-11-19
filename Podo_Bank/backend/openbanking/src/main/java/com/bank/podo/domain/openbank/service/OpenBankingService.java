package com.bank.podo.domain.openbank.service;

import com.bank.podo.domain.openbank.dto.*;
import com.bank.podo.domain.openbank.entity.AccountVerificationCode;
import com.bank.podo.domain.openbank.entity.FintechService;
import com.bank.podo.domain.openbank.entity.FintechUser;
import com.bank.podo.domain.openbank.exception.AlreadyExistUserException;
import com.bank.podo.domain.openbank.exception.FintechServiceNotFoundException;
import com.bank.podo.domain.openbank.exception.VerificationCodeNotMathchException;
import com.bank.podo.domain.openbank.repository.AccountVerificationCodeRepository;
import com.bank.podo.domain.openbank.repository.FintechUserRepository;
import com.bank.podo.domain.openbank.repository.ServiceRepository;
import com.bank.podo.domain.user.entity.User;
import com.bank.podo.global.request.RequestUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenBankingService {

    private final RequestUtil requestUtil;

    private final ServiceRepository serviceRepository;
    private final FintechUserRepository fintechUserRepository;

    private final AccountVerificationCodeRepository accountVerificationCodeRepository;

    @Transactional
    public boolean oneCentVerification(FintechOneCentVerificationDTO fintechOneCentVerificationDTO) {
        FintechService fintechService = serviceRepository.findByServiceCode(fintechOneCentVerificationDTO.getServiceCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        // 이미 해당 서비스에 등록한 경우
        fintechUserRepository.findByFintechServiceAndAccountNumber(fintechService, fintechOneCentVerificationDTO.getAccountNumber())
                .ifPresent(fintechUser -> {throw new AlreadyExistUserException("이미 해당 서비스에 등록된 계좌입니다.");});

        accountVerificationCodeRepository.findById(fintechOneCentVerificationDTO.getAccountNumber())
                .ifPresent(accountVerificationCode -> {throw new AlreadyExistUserException("이미 인증 코드가 발급된 계좌입니다.");});

        String verificationCode = generateVerificationCode(fintechService.getServiceName());

        if(transfer(fintechService.getAccountNumber(), fintechOneCentVerificationDTO.getAccountNumber(),
                    BigDecimal.ONE, "1원 인증", verificationCode)) {
            accountVerificationCodeRepository.save(AccountVerificationCode.builder()
                    .accountNumber(fintechOneCentVerificationDTO.getAccountNumber())
                    .code(verificationCode)
                    .build());
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public UserAccountFintechCodeDTO oneCentVerificationCheck(FintechOneCentVerificationCheckDTO fintechOneCentVerificationCheckDTO) {
        User user = getLoginUser();

        FintechService fintechService =
                serviceRepository.findByServiceCodeAndUser(fintechOneCentVerificationCheckDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        log.info(fintechOneCentVerificationCheckDTO.getAccountNumber());

        AccountVerificationCode accountVerificationCode =
                accountVerificationCodeRepository.findById(fintechOneCentVerificationCheckDTO.getAccountNumber())
                        .orElseThrow(() -> new VerificationCodeNotMathchException("인증 코드가 존재하지 않습니다."));

        // 인증코드 확인
        if(!accountVerificationCode.getCode().equals(fintechOneCentVerificationCheckDTO.getVerificationCode())) {
            throw new VerificationCodeNotMathchException("인증 코드가 일치하지 않습니다.");
        } else {
            accountVerificationCodeRepository.delete(accountVerificationCode);
        }

        String userFintechCode = generateFintechUserCode();

        fintechUserRepository.save(FintechUser.builder()
                .fintechCode(userFintechCode)
                .locked(false)
                .fintechService(fintechService)
                .accountNumber(fintechOneCentVerificationCheckDTO.getAccountNumber())
                .build());

        return UserAccountFintechCodeDTO.builder()
                .fintechCode(userFintechCode)
                .accountNumber(fintechOneCentVerificationCheckDTO.getAccountNumber())
                .serviceCode(fintechService.getServiceCode())
                .build();
    }


    // 사용자 계좌에서 출금
    @Transactional
    public boolean withdrawUserAccount(FintechWithdrawDTO fintechWithdrawDTO) {
        User user = getLoginUser();

        FintechService fintechService = serviceRepository.findByServiceCodeAndUser(fintechWithdrawDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        FintechUser fintechUser = fintechUserRepository.findByFintechServiceAndFintechCode(fintechService, fintechWithdrawDTO.getFintechCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("핀테크 정보가 없습니다."));

        BigDecimal transferAmount = fintechWithdrawDTO.getAmount();

        return transfer(fintechUser.getAccountNumber(), fintechService.getAccountNumber(),
                transferAmount, fintechWithdrawDTO.getContent(), fintechUser.getAccountNumber());
    }

    // 사용자 계좌에 입금
    @Transactional
    public boolean depositUserAccount(FintechDepositDTO fintechDepositDTO) {
        User user = getLoginUser();

        FintechService fintechService = serviceRepository.findByServiceCodeAndUser(fintechDepositDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        FintechUser fintechUser = fintechUserRepository.findByFintechServiceAndFintechCode(fintechService, fintechDepositDTO.getFintechCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("핀테크 정보가 없습니다."));

        BigDecimal transferAmount = fintechDepositDTO.getAmount();

        return transfer(fintechService.getAccountNumber(), fintechUser.getAccountNumber(),
                transferAmount, fintechDepositDTO.getContent(), fintechService.getServiceName());
    }

    @Transactional
    public boolean transfer(String senderAccountNumber, String receiverAccountNumber, BigDecimal amount, String senderContent, String receiverContent) {

        boolean success = requestUtil.transfer(FintechTransferDTO.builder()
                            .senderAccountNumber(senderAccountNumber)
                            .receiverAccountNumber(receiverAccountNumber)
                            .amount(amount)
                            .senderContent(senderContent)
                            .receiverContent(receiverContent)
                            .build());

        logOpenBankingTransfer(senderAccountNumber, receiverAccountNumber, amount, success);

        return success;
    }

    @Transactional(readOnly = true)
    public FintechUserBalanceDTO getUserAccountBalance(FintechUserDTO fintechUserDTO) {
        User user = getLoginUser();

        FintechService fintechService = serviceRepository.findByServiceCodeAndUser(fintechUserDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        FintechUser fintechUser = fintechUserRepository.findByFintechServiceAndFintechCode(fintechService, fintechUserDTO.getFintechCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("핀테크 정보가 없습니다."));

        return requestUtil.getBalance(fintechUser.getAccountNumber());
    }

    @Transactional(readOnly = true)
    public List<TransactionHistoryDTO> getUserAccountTransactionHistory(FintechUserHistoryDTO fintechUserHistoryDTO) {
        User user = getLoginUser();

        FintechService fintechService = serviceRepository.findByServiceCodeAndUser(fintechUserHistoryDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        FintechUser fintechUser = fintechUserRepository.findByFintechServiceAndFintechCode(fintechService, fintechUserHistoryDTO.getFintechCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("핀테크 정보가 없습니다."));

        return requestUtil.getHistory(fintechUser.getAccountNumber(), fintechUserHistoryDTO.getStartAt());
    }

    @Transactional
    public void deleteFintechCode(FintechUserDTO fintechUserDTO) {
        User user = getLoginUser();

        FintechService fintechService = serviceRepository.findByServiceCodeAndUser(fintechUserDTO.getServiceCode(), user)
                .orElseThrow(() -> new FintechServiceNotFoundException("존재하지 않는 서비스입니다."));

        FintechUser fintechUser = fintechUserRepository.findByFintechServiceAndFintechCode(fintechService, fintechUserDTO.getFintechCode())
                .orElseThrow(() -> new FintechServiceNotFoundException("핀테크 정보가 없습니다."));

        fintechUserRepository.delete(fintechUser);
    }

    private String generateFintechUserCode() {
        UUID uuid = UUID.randomUUID();
        String withoutHyphens = uuid.toString().replace("-", "");

        int length = withoutHyphens.length();
        if (length >= 12) {
            return withoutHyphens.substring(length - 12);
        } else {
            return withoutHyphens;
        }
    }

    private String generateVerificationCode(String serviceName) {
        StringBuilder code = new StringBuilder();
        code.append(serviceName);

        Random random = new Random();

        for (int i = 0; i < 4; i++) {
            int randomNumber = random.nextInt(10); // 0부터 9까지의 난수 생성
            code.append(randomNumber);
        }

        return code.toString();
    }

    private User getLoginUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void logOpenBankingTransfer(String senderAccount, String receiverAccount, BigDecimal amount, boolean success) {
        log.info("===== " + "\t"
                + "오픈뱅킹 이체" + "\t"
                + "보내는 계좌번호: " + senderAccount + "\t"
                + "받는 계좌번호: " + receiverAccount + "\t"
                + "이체액: " + amount + "\t"
                + "성공여부: " + success + "\t"
                + " =====");
    }
}
