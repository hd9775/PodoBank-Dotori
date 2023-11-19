package com.bank.podo.domain.account.controller;

import com.bank.podo.domain.account.dto.*;
import com.bank.podo.domain.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/account")
public class AccountController {

    private final PasswordEncoder passwordEncoder;

    private final AccountService accountService;

    @Operation(summary = "계좌 종류 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 종류 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 종류 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음")
    })
    @GetMapping("/type")
    public ResponseEntity<List<AccountCategoryDTO>> getAccountTypeList() {
        List<AccountCategoryDTO> accountCategoryList = accountService.getAccountTypeList();
        return ResponseEntity.ok(accountCategoryList);
    }

    @Operation(summary = "계좌 생성", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 생성 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 생성 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody CreateAccountDTO createAccountDTO) {
        AccountDTO accountDTO = accountService.createAccount(createAccountDTO, passwordEncoder);
        return ResponseEntity.ok(accountDTO);
    }

    @Operation(summary = "계좌 목록 조회", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 목록 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
    })
    @GetMapping("/list")
    public ResponseEntity<List<AccountDTO>> getAccountList() {
        List<AccountDTO> accountList = accountService.getAccountList();
        return ResponseEntity.ok(accountList);
    }

    @Operation(summary = "계좌 소유주 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 소유주 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 소유주 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "404", description = "계좌 없음")
    })
    @GetMapping("/{accountNumber}")
    public ResponseEntity<String> getAccountOwnerName(@PathVariable String accountNumber) {
        String name = accountService.getAccountOwnerName(accountNumber);
        return ResponseEntity.ok(name);
    }

    @Operation(summary = "계좌 상세 조회", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 상세 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 상세 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "404", description = "계좌 없음")
    })
    @GetMapping("/{accountNumber}/detail")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable String accountNumber) {
        AccountDTO account = accountService.getAccountDetail(accountNumber);
        log.info("account: {}", account);
        return ResponseEntity.ok(account);
    }

    @Operation(summary = "계좌 거래 내역 조회", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 거래 내역 조회 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 거래 내역 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "404", description = "계좌 없음")
    })
    @GetMapping("/{accountNumber}/history")
    public ResponseEntity<List<TransactionHistoryDTO>> getAccountHistory(@PathVariable String accountNumber,
                                             @RequestParam(required = false, defaultValue = "1") int searchMonth,
                                             @RequestParam(required = false, defaultValue = "ALL") String transactionType,
                                             @RequestParam(required = false, defaultValue = "0") int sortType,
                                             @RequestParam(required = false, defaultValue = "0") int page) {
        List<TransactionHistoryDTO> accountHistoryList = accountService.getAccountHistory(accountNumber,
                searchMonth, transactionType, sortType, page);
        return ResponseEntity.ok(accountHistoryList);
    }

    @Operation(summary = "계좌 비밀번호 변경", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 비밀번호 변경 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 비밀번호 변경 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PatchMapping("/password/change")
    public ResponseEntity<AccountDTO> changePassword(@RequestBody ChangeAccountPasswordDTO changePasswordDTO) {
        accountService.changePassword(changePasswordDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌 비밀번호 초기화", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 비밀번호 초기화 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 비밀번호 초기화 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PatchMapping("/password/reset")
    public ResponseEntity<AccountDTO> resetPassword(@RequestBody ResetAccountPasswordDTO resetPasswordDTO) {
        accountService.resetPassword(resetPasswordDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌 입금", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 입금 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 입금 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PatchMapping("/deposit")
    public ResponseEntity<AccountDTO> deposit(@RequestBody DepositDTO depositDTO) {
        accountService.userDeposit(depositDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌 출금", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 출금 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 출금 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "402", description = "잔액 부족"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PatchMapping("/withdraw")
    public ResponseEntity<AccountDTO> withdraw(@RequestBody WithdrawDTO withdrawDTO) {
        accountService.userWithdraw(withdrawDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌 이체", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 이체 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 이체 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "402", description = "잔액 부족"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "429", description = "계좌 비밀번호 형식 오류")
    })
    @PatchMapping("/transfer")
    public ResponseEntity<AccountDTO> transfer(@RequestBody TransferDTO transferDTO) {
        accountService.transfer(transferDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "계좌 삭제", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 삭제 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "404", description = "계좌 없음"),
            @ApiResponse(responseCode = "409", description = "잔액이 남아있음")
    })
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteAccount(@RequestBody DeleteAccountDTO deleteAccountDTO) {
        accountService.deleteAccount(deleteAccountDTO, passwordEncoder);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "최근 송금 계좌 조회", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "최근 송금 계좌 조회 성공"),
            @ApiResponse(responseCode = "400", description = "최근 송금 계좌 조회 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "404", description = "계좌 없음")
    })
    @GetMapping("/{accountNumber}/recent")
    public ResponseEntity<List<RecentAccountDTO>> getRecentAccountList(@PathVariable String accountNumber) {
        List<RecentAccountDTO> recentAccountList = accountService.getRecentTransferAccountList(accountNumber);
        return ResponseEntity.ok(recentAccountList);
    }

    @Operation(summary = "계좌 별칭 수정", description = "USER")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "계좌 별칭 수정 성공"),
            @ApiResponse(responseCode = "400", description = "계좌 별칭 수정 실패"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "403", description = "계좌 소유주 불일치"),
            @ApiResponse(responseCode = "404", description = "계좌 없음")
    })
    @PatchMapping("/nickname")
    public ResponseEntity<Void> updateAccountNickname(@RequestBody UpdateAccountNicknameDTO updateAccountNicknameDTO) {
        accountService.updateAccountNickname(updateAccountNicknameDTO);
        return ResponseEntity.ok().build();
    }
}
