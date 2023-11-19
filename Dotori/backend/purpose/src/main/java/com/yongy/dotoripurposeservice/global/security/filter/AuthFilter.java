package com.yongy.dotoripurposeservice.global.security.filter;


import com.yongy.dotoripurposeservice.domain.user.CallUser;
import com.yongy.dotoripurposeservice.domain.user.entity.User;
import com.yongy.dotoripurposeservice.global.security.provider.AuthProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;


@Slf4j
@RequiredArgsConstructor
public class AuthFilter extends GenericFilterBean {

    private final AuthProvider authProvider;

    private final CallUser callUser;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest)request;

        String id = httpServletRequest.getHeader("id");

        if(id != null){
            Authentication authentication = null;
            User user = null;
            try {
                user = callUser.getUserDtoById(id);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }

            if(user != null){
                authentication = authProvider.getAuthentication(user);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(request, response);
    }
}
