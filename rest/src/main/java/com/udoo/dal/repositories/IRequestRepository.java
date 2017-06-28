package com.udoo.dal.repositories;

import com.udoo.dal.entities.request.Request;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IRequestRepository extends Repository<Request, Integer> {

    List<Request> findAll();

    @Query("SELECT r FROM Request r WHERE r.category = :category AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Request> findAllActualByCategory(@Param("category") int category);

    @Query("SELECT r FROM Request r WHERE r.expirydate >= CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Request> findAllActual();

    @Query("SELECT r FROM Request r WHERE r.category = :category AND (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Request> findAllMatches(@Param("category") int category,@Param("searchText") String searchText);

    @Query("SELECT r FROM Request r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Request> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);



    List<Request> findByUid(int uid);

    Request findByRid(int id);

    Request save(Request request);

    @Modifying
    @Transactional
    @Query("DELETE FROM Request r WHERE r.rid= ?1")
    int deleteByRid(int uid);
}
