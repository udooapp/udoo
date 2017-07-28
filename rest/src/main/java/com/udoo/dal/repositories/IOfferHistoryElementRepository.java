package com.udoo.dal.repositories;


import com.udoo.dal.entities.history.OfferHistoryElement;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IOfferHistoryElementRepository extends Repository<OfferHistoryElement, Integer> {
    OfferHistoryElement save(OfferHistoryElement offerHistoryElement);

    List<OfferHistoryElement> findAllByOhidAndActionLessThan(int id, int action);
}
