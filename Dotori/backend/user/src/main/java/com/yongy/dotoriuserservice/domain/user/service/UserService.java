package com.yongy.dotoriuserservice.domain.user.service;

import com.yongy.dotoriuserservice.domain.user.entity.User;
import com.yongy.dotoriuserservice.global.redis.entity.UserRefreshToken;

public interface UserService {
    public void saveUser(User user);

    public void deleteUserRefreshToken(String id);

    public void removeRetireUser(User user);

    public User getUserById(String id);

}
