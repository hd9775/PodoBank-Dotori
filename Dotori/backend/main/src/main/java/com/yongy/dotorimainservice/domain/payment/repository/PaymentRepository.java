package com.yongy.dotorimainservice.domain.payment.repository;

import com.yongy.dotorimainservice.domain.payment.entity.Payment;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentSeq(Long paymentSeq);
    List<Payment> findAllByPlanDetailSeqAndChecked(Long planDetailSeq, boolean checked);

}
