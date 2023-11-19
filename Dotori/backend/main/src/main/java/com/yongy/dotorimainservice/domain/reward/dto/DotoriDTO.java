package com.yongy.dotorimainservice.domain.reward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DotoriDTO {
    Long dotori;
    Long coin;
}
