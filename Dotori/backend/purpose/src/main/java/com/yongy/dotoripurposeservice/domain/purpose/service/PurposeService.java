package com.yongy.dotoripurposeservice.domain.purpose.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.yongy.dotoripurposeservice.domain.purpose.dto.*;
import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.SavingDTO;
import com.yongy.dotoripurposeservice.domain.purpose.dto.communication.SavingDataDTO;
import org.json.simple.parser.ParseException;

import java.io.NotActiveException;

public interface PurposeService {
    void createPurpose(PurposeDTO purposeDTO);
    PurposeAllDTO findAllPurpose(Long userSeq);
    PurposeDetailDTO findPurposeDetail(Long purposeSeq);
    void terminatePurpose(Long purposeSeq);
    PurposeSummaryDTO summarizePurpose(Long purposeSeq);
    void saving(SavingDataDTO savingDataDTO);
    void purposeFinised(PurposeFinisedDTO purposeSeq) throws NotActiveException, JsonProcessingException, ParseException;


}
