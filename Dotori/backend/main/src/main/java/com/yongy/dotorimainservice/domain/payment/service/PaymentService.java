package com.yongy.dotorimainservice.domain.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotorimainservice.domain.payment.dto.PaymentDetailDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UnclassifiedDTO;
import com.yongy.dotorimainservice.domain.payment.dto.UpdateDataDTO;
import com.yongy.dotorimainservice.domain.payment.dto.response.PaymentPodoResDto;
import org.json.simple.parser.ParseException;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentService {
    List<PaymentPodoResDto> getPayments(LocalDateTime updateTime, Long accountSeq) throws ParseException, JsonProcessingException;
    List<PaymentDetailDTO> findAllUnclassified(Long planSeq);
    void updateUnclassified(Long planSeq, UnclassifiedDTO unclassifiedDTO);
}
