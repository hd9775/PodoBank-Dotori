package com.yongy.dotoripurposeservice.domain.purpose.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="purposes")
public class Purpose {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="purpose_seq")
    private Long purposeSeq;

    private Long userSeq;

    @Column(name="purpose_title", nullable = false)
    private String purposeTitle;

    @Column(name="goal_amount", nullable = false)
    private BigDecimal goalAmount;

    @Column(name="current_balance", nullable = false)
    private BigDecimal currentBalance;

    @Column(name="started_at", nullable = false)
    private LocalDate startedAt;

    @Column(name="end_at", nullable = false)
    private LocalDate endAt;

    @Column(name="terminate_at")
    private LocalDateTime terminateAt;

    @Column(name = "finished")
    private boolean finished;

    public void update(Purpose purpose){
        if(purpose.endAt != null){
            this.endAt = purpose.endAt;
        }
        if(purpose.terminateAt != null){
            this.terminateAt = purpose.terminateAt;
        }
        if(purpose.currentBalance != null){
            this.currentBalance = purpose.currentBalance;
        }
    }

    public Purpose addCurrentBalance(BigDecimal amount){
        this.currentBalance = this.currentBalance.add(amount);
        return this;
    }
}
