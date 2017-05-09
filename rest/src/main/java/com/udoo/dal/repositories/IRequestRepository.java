package com.udoo.dal.repositories;


import com.udoo.dal.entities.Request;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IRequestRepository extends Repository<Request, Integer> {

    List<Request> findAll();

    List<Request> findByUid(int uid);

    Request findByRid(int id);

    Request save(Request request);

    @Modifying
    @Transactional
    @Query("delete from Request r where r.rid= ?1")
    int deleteByRid(int uid);
}
