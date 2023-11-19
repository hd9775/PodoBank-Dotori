package com.yongy.dotorimainservice.global.security.provider;


import com.yongy.dotorimainservice.domain.user.entity.User;
import lombok.extern.slf4j.Slf4j;
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

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    public Authentication getAuthentication(User user){
        return new UsernamePasswordAuthenticationToken(user, "", Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())));
    }

}