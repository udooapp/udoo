package com.udoo.dal.repositories;

import com.udoo.dal.entities.Verification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;


/**
 */
public interface IVerificationRepository extends Repository<Verification, Integer> {

    Verification getByToken(String token);

    Verification getByUid(int uid);

    Verification save(Verification reminder);

    @Modifying
    @Transactional
    @Query("delete from Verification v where v.uid= ?1")
    int deleteByUid(int uid);

    @Modifying
    @Transactional
    @Query("delete from Verification v where v.token= ?1")
    int deleteByToken(String token);
}