package com.udoo.dal.repositories.message;

import com.udoo.dal.entities.message.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 */
public interface IMessageRepository extends Repository<Message, Integer> {

    Message save(Message messageElement);

    @Query("SELECT m FROM Message m, UserConversation uc WHERE uc.ucid = m.ucid AND ((uc.fromId = :uid1 AND uc.uid = :uid2) OR (uc.fromId = :uid2 AND uc.uid = :uid1) ) ORDER BY m.date ASC")
    List<Message> findAllByCidOrderByDateDesc(@Param("uid1") int from, @Param("uid2") int to, Pageable page);

}
