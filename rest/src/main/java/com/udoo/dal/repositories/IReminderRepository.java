package com.udoo.dal.repositories;

import com.udoo.dal.entities.Reminder;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;


/**
 */
public interface IReminderRepository extends Repository<Reminder, Integer> {

    Reminder getByToken(String token);

    Reminder save(Reminder reminder);

    @Modifying
    @Transactional
    @Query("delete from Reminder r where r.rid= ?1")
    int deleteByRid(int rid);
}
