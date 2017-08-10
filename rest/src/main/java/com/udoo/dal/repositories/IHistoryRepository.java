package com.udoo.dal.repositories;

import com.udoo.dal.entities.history.History;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;


/**
 */
public interface IHistoryRepository extends Repository<History, Integer> {

    History save(History history);

    List<History> findAllByTidAndType(int tid, int type);

    @Query("Select h From History h, HistoryElement he Where he.hid = h.hid and he.action = :action and h.hid > :hid order by h.date DESC ")
    List<History> findAllByActionAndDateLessThanOrderByDateDesc(@Param("action") int action, @Param("hid") int hid, Pageable page);

    @Query("Select rh From History rh Where rh.hid > :hid and ((rh.type = 0  and rh.tid in (Select u.uid From User u Where u.uid in (Select c.cid From Contact c Where c.uid = :uid))) or (rh.type = 2 and rh.tid in (Select r.rid From Request r Where r.uid in (Select c.cid From Contact c Where c.uid = :uid))) or (rh.type = 1 and rh.tid in (Select o.oid From Offer o Where o.uid in (Select c.cid From Contact c Where c.uid = :uid)))) order by rh.date DESC ")
    List<History> findAllUidAndDateLessThan(@Param("uid") int uid, @Param("hid") int hid, Pageable page);

    @Modifying
    @Transactional
    @Query("delete from History h where h.hid = :hid")
    int deleteByHid(@Param("hid") int hid);
}
