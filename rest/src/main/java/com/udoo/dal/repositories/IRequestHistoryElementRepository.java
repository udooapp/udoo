package com.udoo.dal.repositories;


import com.udoo.dal.entities.history.RequestHistoryElement;
import org.springframework.data.repository.Repository;

import java.util.List;


/**
 */
public interface IRequestHistoryElementRepository extends Repository<RequestHistoryElement, Integer> {
    RequestHistoryElement save(RequestHistoryElement requestHistoryElement);

    List<RequestHistoryElement> findAllByRhidAndActionLessThan(int id, int action);
}
