package com.bank.podo.domain.user.service;

import com.bank.podo.domain.user.dto.*;
import com.bank.podo.domain.user.entity.User;
import com.bank.podo.domain.user.exception.FromatException;
import com.bank.podo.domain.user.exception.PasswordNotMatchException;
import com.bank.podo.domain.user.repository.UserRepository;
import com.bank.podo.global.request.RequestUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final RequestUtil requestUtil;

    private final UserRepository userRepository;

    public void logout() {
        User user = getLoginUser();

        requestUtil.removeRefreshToken(user.getEmail());
        requestUtil.deleteFCMToken(user.getEmail());

        logLogout(user.getEmail());
    }

    @Transactional(readOnly = true)
    public UserInfoDTO getUserInfo() {
        User user = getLoginUser();
        return toUserInfoDTO(user);
    }

    @Transactional
    public void changePassword(ChangePasswordDTO changePasswordDTO, PasswordEncoder passwordEncoder) {
        User user = getLoginUser();

        if(!passwordEncoder.matches(changePasswordDTO.getPassword(), user.getPassword())) {
            throw new PasswordNotMatchException("기존 비밀번호가 일치하지 않습니다.");
        }

        if(changePasswordDTO.getPassword().equals(changePasswordDTO.getNewPassword())) {
            throw new PasswordNotMatchException("기존 비밀번호와 동일합니다.");
        }

        checkPasswordFormat(changePasswordDTO.getNewPassword());

        userRepository.save(user.update(User.builder()
                .password(passwordEncoder.encode(changePasswordDTO.getNewPassword()))
                .build()));

        logChangePassword(user);

        logout();
    }

    @Transactional
    public void resetPassword(ResetPasswordDTO resetPasswordDTO, PasswordEncoder passwordEncoder) {
        User user = userRepository.findByEmail(resetPasswordDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        checkPasswordFormat(resetPasswordDTO.getNewPassword());

        if(!requestUtil.checkVerificationSuccess(CheckSuccessCodeDTO.builder()
                .email(resetPasswordDTO.getEmail())
                .successCode(resetPasswordDTO.getSuccessCode())
                .verificationType("RESET_PASSWORD")
                .build())) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        userRepository.save(user.update(User.builder()
                .password(passwordEncoder.encode(resetPasswordDTO.getNewPassword()))
                .build()));

        logResetPassword(user);
    }

    @Transactional
    public void deleteUser(UserDeleteDTO userDeleteDTO, PasswordEncoder passwordEncoder) {
        User user = getLoginUser();

        if(!passwordEncoder.matches(userDeleteDTO.getPassword(), user.getPassword())) {
            throw new PasswordNotMatchException("비밀번호가 일치하지 않습니다.");
        }

        if(requestUtil.checkAccountBalanceZero(user.getUserId())) {
            throw new IllegalArgumentException("계좌가 존재합니다.");
        }

        userRepository.save(user.delete());

        logDeleteUser(user);
    }

    @Transactional(readOnly = true)
    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    private User getLoginUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void checkPasswordFormat(String password) {
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*#?&])(?=\\S+$).{8,}$";

        if(!Pattern.compile(passwordPattern).matcher(password).matches()) {
            throw new FromatException("비밀번호는 영문, 숫자, 특수문자를 포함하여 8자리 이상이어야 합니다.");
        }
    }

    private UserInfoDTO toUserInfoDTO(User user) {
        return UserInfoDTO.builder()
                .name(user.getName())
                .birthdate(user.getBirthdate())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
    private void logLogout(String email) {
        log.info("===== " + "\t" +
                "로그아웃" + "\t" +
                "이메일: " + email + "\t" +
                "=====");
    }

    private void logChangePassword(User user) {
        log.info("=====" + "\t" +
                "비밀번호 변경" + "\t" +
                "이메일: " + user.getEmail() + "\t" +
                "=====");
    }

    private void logResetPassword(User user) {
        log.info("=====" + "\t" +
                "비밀번호 초기화" + "\t" +
                "이메일: " + user.getEmail() + "\t" +
                "=====");
    }

    private void logDeleteUser(User user) {
        log.info("=====" + "\t" +
                "회원탈퇴" + "\t" +
                "이메일: " + user.getEmail() + "\t" +
                "=====");
    }


}
