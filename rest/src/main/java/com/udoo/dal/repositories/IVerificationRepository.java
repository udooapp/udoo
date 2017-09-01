package com.udoo.dal.repositories;

import com.udoo.dal.entities.Verification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface IVerificationRepository extends Repository<Verification, Integer> {

    Verification getTopByTokenOrderByExpiryDateDesc(String token);

    Verification getTopByUidAndTypeOrderByExpiryDateDesc(int uid, boolean type);

    Verification save(Verification reminder);

    List<Verification> findAllByUid(int uid);

    @Modifying
    @Transactional
    @Query("DELETE FROM Verification v WHERE v.uid= :uid AND v.type = :type")
    int deleteByUid(@Param("uid") int uid, @Param("type") boolean type);

    @Modifying
    @Transactional
    @Query("DELETE FROM Verification v WHERE v.token= ?1")
    int deleteByToken(String token);
}
