package com.udoo.dal.repositories;

import com.udoo.dal.entities.bid.Bid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface IBidRepository extends Repository<Bid, Integer> {

    List<Bid> findAll();

    Bid save(Bid bid);

    Bid findAllByBid(Integer bid);

    List<Bid> findAllBySidAndType(long sid, boolean type);

    int countBySidAndTypeAndAcceptedLessThan(long sid, boolean type, int accepted);

    List<Bid> findAllBySidAndTypeAndUid(long sid, boolean type, long uid);

    @Query("Select distinct b From Bid b, Offer o, Request r Where b.accepted >= 0 and ((o.oid = b.sid and o.uid = :uid and b.type = 1) or (r.rid = b.sid and r.uid = :uid and b.type = 0))")
    List<Bid> findAllByProviderId(@Param("uid") int id, Pageable page);

    List<Bid> findAllByUidOrderByBidDesc(long uid, Pageable page);

    @Modifying
    @Transactional
    @Query("DELETE FROM Bid b WHERE b.bid= :bid")
    int deleteByBid(@Param("bid") int bid);
}
