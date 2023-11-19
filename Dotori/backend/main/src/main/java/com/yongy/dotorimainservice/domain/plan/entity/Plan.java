package com.yongy.dotorimainservice.domain.plan.entity;


import com.yongy.dotorimainservice.domain.account.entity.Account;
import com.yongy.dotorimainservice.domain.planDetail.entity.PlanDetail;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity(name="plans")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="plan_seq")
    private Long planSeq;

    @Column(name = "user_seq")
    private Long userSeq;

    @OneToOne
    @JoinColumn(name = "accountSeq")
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name="plan_state")
    private State planState;

    @Column(name="total_savings", nullable = false)
    private BigDecimal totalSavings;

    @Column(name="save_at")
    private LocalDateTime saveAt;

    @Column(name="start_at")
    private LocalDateTime startAt;

    @Column(name="end_at")
    private LocalDateTime endAt;

    @Column(name="terminate_at")
    private LocalDateTime terminatedAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "unclassified_count", nullable = false)
    private Long count;

    @Column(name = "additional_saving")
    private BigDecimal additionalSaving;

    @OneToMany(mappedBy = "plan")
    private List<PlanDetail> planDetailList;


    public void update(Plan plan){
        this.terminatedAt = plan.terminatedAt;
        this.planState = plan.planState;
    }

    public Plan terminate(LocalDateTime localDateTime){
        this.terminatedAt = localDateTime;
        return this;
    }

    public Plan updateState(State state){
        this.planState = state;
        return this;
    }

    public Plan updateCount(Long count){
        this.count = this.getCount()+count;
        return this;
    }

    public Plan updateAdditionalSaving(BigDecimal additionalSaving){
        this.additionalSaving = additionalSaving;
        return this;
    }

    public Plan finisedPlan(LocalDateTime saveAt){
        this.planState = State.SAVED;
        this.saveAt = saveAt;
        return this;
    }
}