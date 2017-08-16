package com.udoo.dal.repositories.message;

import com.udoo.dal.entities.message.Conversation;
import org.springframework.data.repository.Repository;


/**
 */
public interface IConversationRepository extends Repository<Conversation, Integer> {

    Conversation save(Conversation conversation);

    Conversation findByCid(int cid);

}
