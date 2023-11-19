package com.bank.podo.global.security;

import com.bank.podo.domain.user.entity.User;
import com.bank.podo.domain.user.exception.UserNotFoundException;
import com.bank.podo.domain.user.repository.UserRepository;
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
    private final UserRepository userRepository;
    public Authentication getAuthentication(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("존재하지 않는 아이디입니다."));
        return new UsernamePasswordAuthenticationToken(user, null, Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())));
    }

}
