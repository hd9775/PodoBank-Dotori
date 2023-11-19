package com.yongy.dotoripurposeservice.domain.purposeData.repository;

import com.yongy.dotoripurposeservice.domain.purpose.entity.Purpose;
import com.yongy.dotoripurposeservice.domain.purposeData.entity.PurposeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurposeDataRepository extends JpaRepository<PurposeData, Long> {
    List<PurposeData> findAllByPurpose(Purpose purpose);
}
