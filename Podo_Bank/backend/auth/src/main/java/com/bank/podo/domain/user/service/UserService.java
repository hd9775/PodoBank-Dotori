package com.bank.podo.domain.user.service;

import com.bank.podo.domain.user.dto.*;
import com.bank.podo.domain.user.entity.User;
import com.bank.podo.domain.user.enums.Role;
import com.bank.podo.domain.user.exception.AlreadyUsedUsernameException;
import com.bank.podo.domain.user.exception.FromatException;
import com.bank.podo.domain.user.repository.UserRepository;
import com.bank.podo.global.email.entity.VerificationSuccess;
import com.bank.podo.global.email.enums.VerificationType;
import com.bank.podo.global.email.repository.VerificationSuccessRepository;
import com.bank.podo.global.others.service.RequestHelper;
import com.bank.podo.global.request.RequestUtil;
import com.bank.podo.global.security.entity.RefreshToken;
import com.bank.podo.global.security.entity.Token;
import com.bank.podo.global.security.repository.RefreshTokenRedisRepository;
import com.bank.podo.global.security.service.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final RequestUtil requestUtil;

    private final JwtProvider jwtProvider;

    private final UserRepository userRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final VerificationSuccessRepository verificationSuccessRepository;

    @Transactional
    public void register(RegisterDTO registerDTO, PasswordEncoder passwordEncoder) {
        VerificationSuccess verificationSuccess = verificationSuccessRepository.findById(registerDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 인증이 만료되었습니다."));

        if(!verificationSuccess.getSuccessCode().equals(registerDTO.getSuccessCode())
            || !verificationSuccess.getType().equals(VerificationType.REGISTER)) {
            throw new IllegalArgumentException("이메일 인증이 만료되었습니다.");
        }

        checkPasswordFormat(registerDTO.getPassword());

        checkUsername(registerDTO.getEmail());

        User user = toUserEntity(registerDTO, passwordEncoder);
        userRepository.save(user);

        logRegister(user);
    }

    @Transactional(readOnly = true)
    public void checkUsername(String email) {
        checkEmailFormat(email);
        if(userRepository.existsByEmail(email)) {
            throw new AlreadyUsedUsernameException("이미 사용중인 아이디입니다.");
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> login(HttpServletRequest request, LoginDTO loginDTO, PasswordEncoder passwordEncoder) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("아이디, 비밀번호를 확인해주세요."));

        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디, 비밀번호를 확인해주세요.");
        }

        Token token = jwtProvider.generateToken(user.getEmail(), user.getRole());

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())));

        // refresh token 저장
        refreshTokenRedisRepository.save(RefreshToken.builder()
                        .id(user.getEmail())
                        .ip(RequestHelper.getClientIp(request))
                        .authorities(authentication.getAuthorities())
                        .refreshToken(token.getRefreshToken())
                        .build());

        logLogin(user);

        requestUtil.addFCMToken(user.getEmail(), loginDTO.getToken());

        return ResponseEntity.ok(token);
    }

    @Transactional
    public ResponseEntity<Token> refresh(String token, HttpServletRequest request) {
        if(token != null && jwtProvider.verifyToken(token)) {

            RefreshToken refreshToken = refreshTokenRedisRepository.findByRefreshToken(token);
            if(refreshToken != null) {
                Token newToken = jwtProvider.generateToken(refreshToken.getId(), Role.valueOf(refreshToken.getAuthorities().stream().findFirst().get().getAuthority()));

                refreshTokenRedisRepository.save(RefreshToken.builder()
                        .id(refreshToken.getId())
                        .ip(RequestHelper.getClientIp(request))
                        .authorities(refreshToken.getAuthorities())
                        .refreshToken(newToken.getRefreshToken())
                        .build());
                return ResponseEntity.ok(newToken);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @Transactional
    public void deleteRefreshToken(String email) {
        log.info(email);
        refreshTokenRedisRepository.deleteById(email);

        logDeleteRefreshToken(email);
    }

    public void checkEmailFormat(String email) {
        String emailPattern =
                "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

        if(!Pattern.compile(emailPattern).matcher(email).matches()) {
            throw new FromatException("이메일 형식이 올바르지 않습니다.");
        }
    }

    private void checkPasswordFormat(String password) {
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*#?&])(?=\\S+$).{8,}$";

        if(!Pattern.compile(passwordPattern).matcher(password).matches()) {
            throw new FromatException("비밀번호는 영문, 숫자, 특수문자를 포함하여 8자리 이상이어야 합니다.");
        }
    }

    private User toUserEntity(RegisterDTO registerDTO, PasswordEncoder passwordEncoder) {
        return User.builder()
                .email(registerDTO.getEmail())
                .password(registerDTO.getPassword())
                .name(registerDTO.getName())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .birthdate(registerDTO.getBirthdate())
                .phoneNumber(registerDTO.getPhoneNumber())
                .build();
    }

    private void logRegister(User user) {
        log.info("=====" + "\t" +
                "회원가입" + "\t" +
                "이메일: " + user.getEmail() + "\t" +
                "=====");
    }

    private void logLogin(User user) {
        log.info("=====" + "\t" +
                "로그인" + "\t" +
                "이메일: " + user.getEmail() + "\t" +
                "=====");
    }

    private void logDeleteRefreshToken(String email) {
        log.info("=====" + "\t" +
                "로그아웃" + "\t" +
                "이메일: " + email + "\t" +
                "=====");
    }
}
