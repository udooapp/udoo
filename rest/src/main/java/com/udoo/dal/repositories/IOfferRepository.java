package com.udoo.dal.repositories;


import com.udoo.dal.entities.Offer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IOfferRepository extends Repository<Offer, Integer> {

    List<Offer> findAll();

    List<Offer> findByUid(int uid);

    Offer findByOid(int id);

    Offer save(Offer offer);

    @Modifying
    @Transactional
    @Query("delete from Offer o where o.oid = ?1")
    int deleteByOid(int uid);
}
