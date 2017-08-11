package com.udoo.dal.repositories;

import com.udoo.dal.entities.request.RequestLite;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 */
public interface IRequestLiteRepository extends Repository<RequestLite, Integer> {


    @Query("SELECT r FROM RequestLite r WHERE r.category = :category AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllActualByCategory(@Param("category") int category);

    @Query("SELECT r FROM RequestLite r WHERE r.expirydate >= CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllActual();

    @Query("SELECT r FROM RequestLite r WHERE r.category = :category AND (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllMatches(@Param("category") int category, @Param("searchText") String searchText);

    @Query("SELECT r FROM RequestLite r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);

    @Query("SELECT r FROM RequestLite r WHERE r.expirydate >= CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllActual(Pageable page);

    @Query("SELECT r FROM RequestLite r WHERE r.category = :category AND (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllMatches(@Param("category") int category, @Param("searchText") String searchText, Pageable page);

    @Query("SELECT r FROM RequestLite r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<RequestLite> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText, Pageable page);

}
