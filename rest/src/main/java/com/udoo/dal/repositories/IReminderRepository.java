package com.udoo.dal.repositories;

import com.udoo.dal.entities.Reminder;
import org.springframework.data.repository.Repository;



/**
 */
public interface IReminderRepository extends Repository<Reminder, Integer> {

    Reminder getByToken(String token);

    Reminder save(Reminder reminder);

    boolean deleteByRid(int rid);
}
