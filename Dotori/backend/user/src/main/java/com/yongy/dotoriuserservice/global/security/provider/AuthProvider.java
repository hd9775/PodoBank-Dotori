package com.yongy.dotoriuserservice.global.security.provider;

import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;


@Slf4j
@Component
public class AuthProvider {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    public Authentication getAuthentication(User user){
        return new UsernamePasswordAuthenticationToken(user, "", Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())));
    }

    // SecurityContextHolder에 저장되어 있는 User 객체 가져오기
    public User getUserFromHeaderId(String id){
        return userRepository.findByIdAndExpiredAtIsNull(id);
    }
}