package com.udoo.dal.repositories;


import com.udoo.dal.entities.Request;
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

    @Query("SELECT o FROM Request o WHERE o.category = :category AND o.expirydate > CURRENT_DATE")
    List<Request> findAllActualByCategory(@Param("category") int category);

    @Query("SELECT o FROM Request o WHERE o.expirydate >= CURRENT_DATE")
    List<Request> findAllActual();

    @Query("SELECT o FROM Request o WHERE o.category = :category AND (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate > CURRENT_DATE")
    List<Request> findAllMatches(@Param("category") int category,@Param("searchText") String searchText);

    @Query("SELECT o FROM Request o WHERE (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate > CURRENT_DATE")
    List<Request> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);


    List<Request> findByUid(int uid);

    Request findByRid(int id);

    Request save(Request request);

    @Modifying
    @Transactional
    @Query("DELETE FROM Request r WHERE r.rid= ?1")
    int deleteByRid(int uid);
}
