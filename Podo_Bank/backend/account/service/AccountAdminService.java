package com.bank.podo.domain.account.service;

import com.bank.podo.domain.account.dto.*;
import com.bank.podo.domain.account.entity.Account;
import com.bank.podo.domain.account.entity.TransactionHistory;
import com.bank.podo.domain.account.enums.TransactionType;
import com.bank.podo.domain.account.exception.AccountNotFoundException;
import com.bank.podo.domain.account.exception.InsufficientBalanceException;
import com.bank.podo.domain.account.exception.PasswordRetryCountExceededException;
import com.bank.podo.domain.account.repository.AccountRepository;
import com.bank.podo.domain.account.repository.TransactionHistoryRepository;
import com.bank.podo.global.others.service.FCMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountAdminService {

    private final AccountService accountService;
    private final FCMService fcmService;

    private final AccountRepository accountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;

    @Transactional(noRollbackFor = PasswordRetryCountExceededException.class)
    public void transfer(AdminTransferDTO transferDTO) {
        Account senderAccount = accountRepository.findByAccountNumberAndDeletedFalse(transferDTO.getSenderAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));
        Account receiverAccount = accountRepository.findByAccountNumberAndDeletedFalse(transferDTO.getReceiverAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        BigDecimal transferAmount = transferDTO.getAmount();

        accountService.withdraw(senderAccount, transferAmount, transferDTO.getSenderContent(), null);
        accountService.deposit(receiverAccount, transferAmount, transferDTO.getReceiverContent(), null);

        fcmService.sendNotification(receiverAccount.getUser().getEmail(), "입금", transferAmount.toString() + "원이 입금되었습니다."+"\n"+transferDTO.getReceiverContent());
        fcmService.sendNotification(senderAccount.getUser().getEmail(), "출금", transferAmount.toString() + "원이 출금되었습니다."+ "\n"+transferDTO.getSenderContent());

        logTransfer(senderAccount, receiverAccount, transferAmount);
    }

    @Transactional(readOnly = true)
    public AdminBalanceDTO balance(AdminBalanceDTO balanceDTO) {
        Account account = accountRepository.findByAccountNumberAndDeletedFalse(balanceDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        balanceDTO.setBalance(account.getBalance());

        logBalance(account);

        return balanceDTO;
    }

    @Transactional(readOnly = true)
    public List<TransactionHistoryDTO> history(AdminHistoryDTO historyDTO) {
        Account account = accountRepository.findByAccountNumberAndDeletedFalse(historyDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        List<TransactionHistory> transactionHistoryList =
                transactionHistoryRepository.findAllByAccountAndCreatedAtGreaterThanEqual(account, historyDTO.getStartAt());

        logHistory(account);

        return toTransactionHistoryDTOList(transactionHistoryList);
    }

    public void withdraw(WithdrawDTO withdrawDTO) {
        Account account = accountRepository.findByAccountNumberAndDeletedFalse(withdrawDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        accountService.withdraw(account, withdrawDTO.getAmount(), withdrawDTO.getContent(), null);

        fcmService.sendNotification(account.getUser().getEmail(), "출금", withdrawDTO.getAmount().toString() + "원이 출금되었습니다."+ "\n"+withdrawDTO.getContent());
    }

    public void deposit(DepositDTO depositDTO) {
        Account account = accountRepository.findByAccountNumberAndDeletedFalse(depositDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        accountService.deposit(account, depositDTO.getAmount(), depositDTO.getContent(), null);

        fcmService.sendNotification(account.getUser().getEmail(), "입금", depositDTO.getAmount().toString() + "원이 입금되었습니다."+ "\n"+depositDTO.getContent());
    }

    public void test1(String accountNumber) {
        log.info(accountNumber);
        Account account = accountRepository.findByAccountNumber(accountNumber);
        log.info(account.toString());

        accountService.withdraw(account, new BigDecimal(8000), "무인아이스크림할인점", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "8000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(12000), "요기요_위대한상상", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "12000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(9000), "플러스마트", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "9000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(10000), "유니버시아드레포츠센터", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "10000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(20000), "크로스핏진평", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "20000 출금되었습니다.");

    }

    public void test2(String accountNumber) {
        log.info(accountNumber);
        Account account = accountRepository.findByAccountNumber(accountNumber);
        log.info(account.toString());

        accountService.withdraw(account, new BigDecimal(8000), "올리브영구미인동점", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "8000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(11000), "한국철도공사", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "11000 출금되었습니다.");

        accountService.withdraw(account, new BigDecimal(9500), "커피비치", "3456789012");
        fcmService.sendNotification(account.getUser().getEmail(), "출금", "9500 출금되었습니다.");

    }

    private List<TransactionHistoryDTO> toTransactionHistoryDTOList(List<TransactionHistory> transactionHistoryList) {
        return transactionHistoryList.stream()
                .map(this::toTransactionHistoryDTO)
                .collect(Collectors.toList());
    }

    private TransactionHistoryDTO toTransactionHistoryDTO(TransactionHistory transactionHistory) {
        TransactionHistoryDTO.TransactionHistoryDTOBuilder builder = TransactionHistoryDTO.builder()
                .transactionType(transactionHistory.getTransactionType())
                .transactionAt(transactionHistory.getCreatedAt())
                .amount(transactionHistory.getAmount())
                .balanceAfter(transactionHistory.getBalanceAfter())
                .businessCode(transactionHistory.getBusinessCode())
                .content(transactionHistory.getContent());

        if (transactionHistory.getCounterAccount() != null) {
            builder.counterAccountName(transactionHistory.getCounterAccount().getUser().getName());
        }

        return builder.build();
    }

    private void logTransfer(Account senderAccount, Account receiverAccount, BigDecimal transferAmount) {
        log.info("=====" + "\t"
                + "송금(Admin)" + "\t"
                + "송금 계좌 번호: " + senderAccount.getAccountNumber() + "\t"
                + "수신 계좌 번호: " + receiverAccount.getAccountNumber() + "\t"
                + "송금액: " + transferAmount + "\t"
                + "=====");
    }

    private void logBalance(Account account) {
        log.info("=====" + "\t"
                + "잔액 조회(Admin)" + "\t"
                + "계좌 번호: " + account.getAccountNumber() + "\t"
                + "=====");
    }

    private void logHistory(Account account) {
        log.info("===== " + "\t"
                + "거래 내역 조회(Admin)" + "\t"
                + "계좌 번호: " + account.getAccountNumber() + "\t"
                + " =====");
    }
}
