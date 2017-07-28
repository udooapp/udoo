package com.udoo.dal.repositories;

import com.udoo.dal.entities.history.UserHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;


/**
 */
public interface IUserHistoryRepository extends Repository<UserHistory, Integer> {

    UserHistory save(UserHistory history);

    @Query("Select uh From UserHistory uh, UserHistoryElement uhe Where uhe.uhid = uh.uhid and uhe.action = :action and uh.date < :date order by uh.date DESC ")
    List<UserHistory> findAllByActionAndDateLessThanOrderByDateDesc(@Param("action") int action, @Param("date") Date date, Pageable page);

    @Query("Select uh From UserHistory uh Where uh.date < :date and uh.uid in (Select c.cid From Contact c Where c.uid = :uid) order by uh.date DESC ")
    List<UserHistory> findAllByUidAndDateLessThan(@Param("uid") int uid,@Param("date") Date date, Pageable page);
}
