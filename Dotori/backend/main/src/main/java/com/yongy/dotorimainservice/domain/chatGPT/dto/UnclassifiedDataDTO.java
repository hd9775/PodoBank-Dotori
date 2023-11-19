package com.yongy.dotorimainservice.domain.chatGPT.dto;

import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UnclassifiedDataDTO {
    List<PlanDetail> planDetails;
    List<Payment> payments;

    @Override
    public String toString() {
        return "planDetails=" + planDetails +
                ", payments=" + payments;
    }
}
