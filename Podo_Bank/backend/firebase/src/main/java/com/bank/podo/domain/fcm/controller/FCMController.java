package com.bank.podo.domain.fcm.controller;

import com.bank.podo.domain.fcm.dto.FCMNotificationRequestDTO;
import com.bank.podo.domain.fcm.util.FCMUtil;
import com.bank.podo.domain.fcm.dto.AddFCMTokenDTO;
import com.bank.podo.domain.fcm.dto.DeleteFCMTokenDTO;
import com.bank.podo.domain.fcm.service.FCMService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/fcm")
public class FCMController {
    private final FCMUtil fcmUtil;

    private final FCMService fcmService;

    @PostMapping("/addToken")
    public void addToken(@RequestBody AddFCMTokenDTO addFCMTokenDTO) {
        log.info("addToken: {}", addFCMTokenDTO);
        fcmService.addToken(addFCMTokenDTO);
    }

    @PostMapping("/deleteToken")
    public void deleteToken(@RequestBody DeleteFCMTokenDTO deleteFCMTokenDTO) {
        log.info("deleteToken: {}", deleteFCMTokenDTO);
        fcmService.deleteToken(deleteFCMTokenDTO);
    }

    @Operation(summary = "푸시 알림 보내기")
    @PostMapping("/send")
    public String sendNotification(@RequestBody FCMNotificationRequestDTO fcmNotificationRequestDTO) {
        log.info("sendNotification: {}", fcmNotificationRequestDTO);
        return fcmService.sendNotificationByToken(fcmNotificationRequestDTO);
    }
}
