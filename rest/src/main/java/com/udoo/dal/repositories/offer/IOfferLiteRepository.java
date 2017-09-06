package com.udoo.dal.repositories.offer;


import com.udoo.dal.entities.offer.OfferLite;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 */
public interface IOfferLiteRepository extends Repository<OfferLite, Integer> {

    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and o.category = :category AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllActualByCategory(@Param("category") int category);

    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllActual();


    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and o.category = :category AND (LOWER(o.description) LIKE CONCAT('%',lower(:searchText),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllMatches(@Param("category") int category, @Param("searchText") String searchText);

    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);


    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and o.category = :category AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllActualByCategory(@Param("category") int category, Pageable page);

    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllActual(Pageable page);

    @Query("SELECT o FROM OfferLite o WHERE o.completed = true and (LOWER(o.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR lower(o.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND o.expirydate >= CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)")
    List<OfferLite> findAllByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText, Pageable page);

}
