package com.yongy.dotorimainservice.domain.chatGPT.controller;

import com.yongy.dotorimainservice.domain.chatGPT.dto.CategoryDataDTO;
import com.yongy.dotorimainservice.domain.chatGPT.dto.ResultDataDTO;
import com.yongy.dotorimainservice.domain.chatGPT.service.ChatGPTService;
import com.yongy.dotorimainservice.global.scheduler.PaymentsScheduler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.ParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chatgpt")
public class ChatGPTController {

    private final ChatGPTService chatGPTService;

    @Operation(summary = "카테고리그룹에 따라 카테고리 분류")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "카테고리 분류 성공")
    })
    @PostMapping()
    public ResponseEntity<List<ResultDataDTO>> categoryChatGPT(@RequestBody CategoryDataDTO categoryDataDTO) throws Exception {
        return ResponseEntity.ok().body(chatGPTService.getChatGPTResponse(categoryDataDTO));
    }

    @Operation(summary = "카테고리에 따라 payment 분류")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "payment 분류 성공")
    })
    @PatchMapping("/unclassified")
    public ResponseEntity<Void> unclassifiedChatGPT() throws IOException, ParseException {
        chatGPTService.getPayments();
        return ResponseEntity.ok().build();
    }
}
