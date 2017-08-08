package com.udoo.dal.repositories;

import com.udoo.dal.entities.Contact;
import org.springframework.data.domain.Pageable;
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
    List<Contact> findByUid(int uid, Pageable page);

    Contact save(Contact contact);

    Contact getAllByUidAndCid(int uid, int cid);

    @Modifying
    @Transactional
    @Query("DELETE FROM Contact r WHERE r.uid= :uid  AND r.cid = :cid")
    int deleteByIds(@Param("uid") int uid, @Param("cid") int cid);
}
