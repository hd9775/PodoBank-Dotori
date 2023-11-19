package com.yongy.dotoripurposeservice.domain.purpose.repository;


import com.yongy.dotoripurposeservice.domain.purpose.entity.Purpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurposeRepository extends JpaRepository<Purpose, Long> {
    Purpose findByPurposeSeq(Long purposeSeq);
    List<Purpose> findAllByUserSeqAndFinishedIsFalse(Long userSeq);

}
