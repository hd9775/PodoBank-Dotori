package com.bank.podo.domain.fcm.service;

import com.bank.podo.domain.fcm.dto.AddFCMTokenDTO;
import com.bank.podo.domain.fcm.dto.DeleteFCMTokenDTO;
import com.bank.podo.domain.fcm.dto.FCMNotificationRequestDTO;
import com.bank.podo.domain.fcm.entity.FCMToken;
import com.bank.podo.domain.fcm.repository.FCMRepository;
import com.bank.podo.domain.fcm.util.FCMUtil;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FCMService {
    private final FCMUtil fcmUtil;
    private final FCMRepository fcmRepository;

    @Transactional
    public void addToken(AddFCMTokenDTO addFCMTokenDTO) {
        FCMToken fcmToken = fcmRepository.findByEmail(addFCMTokenDTO.getEmail()).orElse(null);

        if(fcmRepository.findByEmail(addFCMTokenDTO.getEmail()).isPresent()) {
            fcmToken.updateToken(addFCMTokenDTO.getToken());
            fcmRepository.save(fcmToken);
        } else {
            fcmRepository.save(FCMToken.builder()
                    .email(addFCMTokenDTO.getEmail())
                    .token(addFCMTokenDTO.getToken())
                    .build());
        }
    }

    @Transactional
    public void deleteToken(DeleteFCMTokenDTO deleteFCMTokenDTO) {
        fcmRepository.deleteByEmail(deleteFCMTokenDTO.getEmail());
    }

    @Transactional(readOnly = true)
    public String sendNotificationByToken(FCMNotificationRequestDTO fcmNotificationRequestDTO) {
        Optional<FCMToken> fcmToken = fcmRepository.findByEmail(fcmNotificationRequestDTO.getTargetUserEmail());

        if(fcmToken.isPresent()) {
            if(fcmToken.get().getToken() != null) {
                fcmUtil.requestAlert(fcmToken.get().getToken(), fcmNotificationRequestDTO.getTitle(), fcmNotificationRequestDTO.getBody());
            } else {
                return "no token";
            }
        } else {
            return "no user";
        }
        return "success";
    }
}
