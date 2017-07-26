package com.udoo.dal.repositories;

import com.udoo.dal.entities.history.OfferHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;


/**
 */
public interface IOfferHistoryRepository extends Repository<OfferHistory, Integer> {

    OfferHistory save(OfferHistory history);

    List<OfferHistory> findFirst5ByActionAndDateLessThanOrderByDateDesc(int action, Date date, Pageable page);

    @Query("Select oh From OfferHistory oh Where oh.date < :date and oh.oid in (Select o.oid From Offer o Where o.uid in (Select c.cid From Contact c Where c.uid = :uid)) order by oh.date DESC")
    List<OfferHistory> findAllByUidAndDateLessThan(@Param("uid") int uid, @Param("date") Date date, Pageable page);
}
