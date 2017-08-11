package com.udoo.dal.repositories;

import com.udoo.dal.entities.request.Request;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IRequestRepository extends Repository<Request, Integer> {
    List<Request> findByUid(int uid);
    List<Request> findByUid(int uid, Pageable page);

    Request findByRid(int id);

    Request save(Request request);

    @Modifying
    @Transactional
    @Query("DELETE FROM Request r WHERE r.rid= ?1")
    int deleteByRid(int uid);
}
