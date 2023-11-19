package com.yongy.dotoriAuthService.domain.user.service;


import com.yongy.dotoriAuthService.domain.user.dto.request.UserInfoReqDto;
import com.yongy.dotoriAuthService.domain.user.entity.Provider;
import com.yongy.dotoriAuthService.domain.user.entity.Role;
import com.yongy.dotoriAuthService.domain.user.entity.User;
import com.yongy.dotoriAuthService.domain.user.repository.UserRepository;
import com.yongy.dotoriAuthService.global.email.EmailUtil;
import com.yongy.dotoriAuthService.global.redis.entity.EmailAuth;
import com.yongy.dotoriAuthService.global.redis.entity.UserRefreshToken;
import com.yongy.dotoriAuthService.global.redis.repository.EmailAuthRepository;
import com.yongy.dotoriAuthService.global.redis.repository.UserRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailAuthRepository emailAuthRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private UserRefreshTokenRepository userRefreshTokenRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    // NOTE : 이메일 인증코드를 생성한다.
    public void emailCertification(String id){
        Random random = new Random();
        String authCode = String.valueOf(random.nextInt(8888) + 1111); // 1111 ~ 9999의 랜덤한 숫자
        sendEmailAuthCode(id, authCode);
    }

    // NOTE : 인증코드를 사용자 이메일로 전송한다.
    public void sendEmailAuthCode(String id, String authCode){
        emailUtil.setSubject("도토리의 인증번호");
        emailUtil.setPrefix("회원 가입을 위한 인증번호는 ");
        emailUtil.sendEmailAuthCode(id, authCode);
        emailAuthRepository.save(EmailAuth.of(id, authCode));
    }

    // NOTE : EmailAuth 반환
    public EmailAuth getEmailAuth(String authCode){
        return emailAuthRepository.findByAuthCode(authCode);
    }

    // NOTE : EmailAuth 삭제
    public void deleteEmailAuth(String email){
        emailAuthRepository.deleteById(email);
    }

    // NOTE : 사용자를 가져온다.
    public User getUser(String id){
        return userRepository.findByIdAndExpiredAtIsNull(id);
    }

    // NOTE : 사용자를 저장한다.
    public User saveUser(User user){
        userRepository.save(user);
        return user;
    }

    // NOTE : 사용자의 RefreshToken을 RedisDB에 저장한다.
    public void saveUserRefreshToken(UserRefreshToken userRefreshToken){
        userRefreshTokenRepository.save(userRefreshToken);
    }

    // NOTE : 사용자의 RefreshToken에 맞는 UserRefreshToken을 가져온다.
    public UserRefreshToken getUserRefreshToken(String refreshToken){
        return userRefreshTokenRepository.findByRefreshToken(refreshToken);
    }

    public User userSingup(UserInfoReqDto userInfoReqDto){
        User user = User.builder()
                .id(userInfoReqDto.getId())
                .password(passwordEncoder.encode(userInfoReqDto.getPassword())) // 비밀번호 암호화해서 저장하기
                .userName(userInfoReqDto.getUserName())
                .birthDate(LocalDate.parse(userInfoReqDto.getBirthDate()))
                .phoneNumber(userInfoReqDto.getPhoneNumber())
                .authProvider(Provider.DOTORI)
                .role(Role.ROLE_USER)
                .build();
        userRepository.save(user);
        return user;
    }


}
