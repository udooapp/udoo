package com.udoo.dal.repositories;


import com.udoo.dal.entities.offer.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 */
public interface IOfferRepository extends Repository<Offer, Integer> {

    @Query("SELECT o FROM Offer o WHERE o.category = :category AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllActualByCategory(@Param("category") int category);

    @Query("SELECT o FROM Offer o WHERE o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllActual();

    List<Offer> findByUid(int uid);
    List<Offer> findByUid(int uid, Page page);


    @Query("SELECT o FROM Offer o WHERE  o.category = :category AND (LOWER(o.description) LIKE CONCAT('%',lower(:searchText),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllMatches(@Param("category") int category, @Param("searchText") String searchText);

    @Query("SELECT o FROM Offer o WHERE (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);


    @Query("SELECT o FROM Offer o WHERE o.category = :category AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllActualByCategory(@Param("category") int category, Pageable page);

    @Query("SELECT o FROM Offer o WHERE o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllActual(Pageable page);

    List<Offer> findByUid(int uid, Pageable page);


    @Query("SELECT o FROM Offer o WHERE  o.category = :category AND (LOWER(o.description) LIKE CONCAT('%',lower(:searchText),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllMatches(@Param("category") int category, @Param("searchText") String searchText, Pageable page);

    @Query("SELECT o FROM Offer o WHERE (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<Offer> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText, Pageable page);

    Offer findByOid(int id);

    Offer save(Offer offer);

    @Modifying
    @Transactional
    @Query("delete from Offer o where o.oid = ?1")
    int deleteByOid(int uid);
}
