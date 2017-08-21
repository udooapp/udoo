package com.udoo.dal.repositories.message;

import com.udoo.dal.entities.message.UserConversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;
import java.util.List;


/**
 */
public interface IUserConversationRepository extends Repository<UserConversation, Integer> {

    UserConversation save(UserConversation conversation);

    UserConversation getByUidAndFromId(int uid, int cid);

    List<UserConversation> findAllByFromIdAndChecked(int uid, boolean checked);

    List<UserConversation> findByUid(int uid, Pageable page);

    List<UserConversation> findByFromId(int uid, Pageable page);



}
