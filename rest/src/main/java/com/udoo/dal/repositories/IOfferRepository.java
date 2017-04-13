package com.udoo.dal.repositories;


import com.udoo.dal.entities.Offer;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IOfferRepository extends Repository<Offer, Integer> {

    List<Offer> findAll();

    List<Offer> findByUid(int uid);

    Offer findByOid(int id);

    Offer save(Offer offer);
}
