package com.udoo.dal.repositories;


import com.udoo.dal.entities.history.HistoryElement;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IHistoryElementRepository extends Repository<HistoryElement, Integer> {
    HistoryElement save(HistoryElement historyElement);

    List<HistoryElement> findAllByHidAndActionLessThan(int id, int action);
}
