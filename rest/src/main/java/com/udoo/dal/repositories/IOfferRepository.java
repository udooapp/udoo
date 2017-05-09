package com.udoo.dal.repositories;


import com.udoo.dal.entities.Offer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import com.udoo.dal.entities.Request;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

/**
 */
public interface IOfferRepository extends Repository<Offer, Integer> {

    List<Offer> findAllByCategory(int category);


    List<Offer> findAll();

    @Query("SELECT o FROM Offer o WHERE o.expirydate >= CURRENT_DATE ")
    List<Offer> findAllActual();

    List<Offer> findByUid(int uid);

    @Query("SELECT o FROM Offer o WHERE  o.category = :category AND (LOWER(o.description) LIKE CONCAT('%',lower(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',lower(:searchText),'%')) AND o.expirydate >= CURRENT_DATE ")
    List<Offer> findAllMatches(@Param("category") int category, @Param("searchText") String searchText);

    @Query("SELECT o FROM Offer o WHERE LOWER(o.description) LIKE CONCAT('%',lower(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',lower(:searchText),'%') AND o.expirydate >= CURRENT_DATE ")
    List<Offer> findAllByTitleContainingOrDescriptionContaining(String searchText);

    Offer findByOid(int id);

    Offer save(Offer offer);

    @Modifying
    @Transactional
    @Query("delete from Offer o where o.oid = ?1")
    int deleteByOid(int uid);
}
