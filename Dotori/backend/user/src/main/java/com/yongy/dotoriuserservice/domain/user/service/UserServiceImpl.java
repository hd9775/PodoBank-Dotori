package com.yongy.dotoriuserservice.domain.user.service;


import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.domain.user.repository.UserRepository;
import com.yongy.dotoriuserservice.global.redis.entity.UserRefreshToken;
import com.yongy.dotoriuserservice.global.redis.repository.UserRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRefreshTokenRepository userRefreshTokenRepository;


    // NOTE : 사용자를 저장한다.
    public void saveUser(User user){
        userRepository.save(user);
    }


    // NOTE : 사용자의 RefreshToken에 맞는 UserRefreshToken을 삭제한다.
    public void deleteUserRefreshToken(String id){
        userRefreshTokenRepository.deleteById(id);
    }


    // NOTE : 사용자 탈퇴하기
    public void removeRetireUser(User user){
        user.setExpiredAt(LocalDateTime.now());
        this.saveUser(user);
    }

    public User getUserById(String id){
        return userRepository.findByIdAndExpiredAtIsNull(id);
    }

}
