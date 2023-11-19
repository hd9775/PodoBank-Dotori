package com.bank.podo.global.security.filter;

import com.bank.podo.global.security.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    private final String HEADER_KEY = "Authorization";
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String userEmail = request.getHeader("userEmail");

        if (userEmail != null) {
            // 인증 정보가 존재할 때의 처리
            Authentication authentication = jwtProvider.getAuthentication(userEmail);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info(userEmail);
        } else {
            // 인증 정보가 존재하지 않을 때의 처리
            log.info("authentication is null");
        }

        filterChain.doFilter(request, response);
    }
}
