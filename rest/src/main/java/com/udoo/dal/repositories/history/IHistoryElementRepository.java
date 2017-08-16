package com.udoo.dal.repositories.history;


import com.udoo.dal.entities.history.HistoryElement;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IHistoryElementRepository extends Repository<HistoryElement, Integer> {
    HistoryElement save(HistoryElement historyElement);

    List<HistoryElement> findAllByHidAndActionLessThan(int id, int action);

    @Modifying
    @Transactional
    @Query("delete from HistoryElement h where h.hid = :hid")
    int deleteByHid(@Param("hid") int hid);
}
