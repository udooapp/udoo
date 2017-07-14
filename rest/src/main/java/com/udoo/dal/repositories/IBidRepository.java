package com.udoo.dal.repositories;

import com.udoo.dal.entities.Bid;
import org.springframework.data.repository.Repository;

import java.util.List;


/**
 */
public interface IBidRepository extends Repository<Bid, Integer> {

    List<Bid> findAll();

    Bid save(Bid bid);

    Bid findAllByBid(Integer bid);

    List<Bid> findAllBySidAndType(long sid, boolean type);

    int countBySidAndType(long sid, boolean type);

    List<Bid> findAllBySidAndTypeAndUid(long sid, boolean type, long uid);
}
