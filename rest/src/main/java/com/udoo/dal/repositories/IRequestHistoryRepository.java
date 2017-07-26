package com.udoo.dal.repositories;

import com.udoo.dal.entities.history.RequestHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;


/**
 */
public interface IRequestHistoryRepository extends Repository<RequestHistory, Integer> {

    RequestHistory save(RequestHistory history);

    List<RequestHistory> findFirst5ByActionAndDateLessThanOrderByDateDesc(int action, Date date, Pageable page);

    @Query("Select rh From RequestHistory rh Where rh.date < :date and rh.rid in (Select r.rid From Request r Where r.uid in (Select c.cid From Contact c Where c.uid = :uid)) order by rh.date DESC ")
    List<RequestHistory> findAllByUidAndDateLessThan(@Param("uid") int uid, @Param("date") Date date, Pageable page);
}
