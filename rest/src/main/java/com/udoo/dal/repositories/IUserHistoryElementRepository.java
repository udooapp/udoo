package com.udoo.dal.repositories;


import com.udoo.dal.entities.history.UserHistoryElement;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IUserHistoryElementRepository extends Repository<UserHistoryElement, Integer> {

    UserHistoryElement save(UserHistoryElement userHistoryElement);

    List<UserHistoryElement> findAllByUhidAndActionLessThan(int uheid, int action);
}
