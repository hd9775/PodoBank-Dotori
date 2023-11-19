package com.bank.podo.global.security.service;

import com.bank.podo.domain.user.entity.User;
import com.bank.podo.global.request.RequestUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtProvider {
    private final RequestUtil requestUtil;

    public Authentication getAuthentication(String email) {
        User user = requestUtil.getUser(email);
        if(user == null) {
            return null;
        }
        return new UsernamePasswordAuthenticationToken(user, null, Collections.singleton(new SimpleGrantedAuthority(user.getRole())));
    }
}
