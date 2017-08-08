package com.udoo.dal.repositories;

import com.udoo.dal.entities.Notification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface INotificationRepository extends Repository<Notification, Integer> {

    Notification save(Notification notification);

    List<Notification> findAllByUid(int uid);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.nid= :nid")
    int deleteByNid(@Param("nid") int nid);
}
