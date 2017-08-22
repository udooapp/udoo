package com.udoo.dal.repositories;

import com.udoo.dal.entities.Verification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;


/**
 */
public interface IVerificationRepository extends Repository<Verification, Integer> {

    Verification getTopByTokenOrderByExpiryDateDesc(String token);

    Verification getTopByUidAndTypeOrderByExpiryDateDesc(int uid, boolean type);

    Verification save(Verification reminder);

    @Modifying
    @Transactional
    @Query("delete from Verification v where v.uid= ?1 and v.type = ?2")
    int deleteByUid(int uid, boolean type);

    @Modifying
    @Transactional
    @Query("delete from Verification v where v.token= ?1")
    int deleteByToken(String token);
}
