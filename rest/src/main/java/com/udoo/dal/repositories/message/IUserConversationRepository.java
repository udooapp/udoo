package com.udoo.dal.repositories.message;

import com.udoo.dal.entities.message.UserConversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;
import java.util.List;


/**
 */
public interface IUserConversationRepository extends Repository<UserConversation, Integer> {

    UserConversation save(UserConversation conversation);

    UserConversation getTopByUidAndFromId(int sender, int receiver);

    UserConversation findByUcid(int ucid);

    List<UserConversation> findByUid(int uid, Pageable page);

    List<UserConversation> findByFromId(int uid, Pageable page);



}
