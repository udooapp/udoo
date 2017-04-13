package com.udoo.dal.repositories;


import com.udoo.dal.entities.Request;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IRequestRepository extends Repository<Request, Integer> {

    List<Request> findAll();

    List<Request> findByUid(int uid);

    Request findByRid(int id);

    Request save(Request request);
}
