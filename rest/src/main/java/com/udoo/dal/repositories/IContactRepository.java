package com.udoo.dal.repositories;

import com.udoo.dal.entities.Contact;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface IContactRepository extends Repository<Contact, Integer> {

    List<Contact> findByUid(int uid);

    Contact save(Contact contact);

    @Modifying
    @Transactional
    @Query("DELETE FROM Contact r WHERE r.uid= :uid  AND r.cid = :cid")
    int deleteByIds(@Param("uid") int uid, @Param("cid") int cid);
}
