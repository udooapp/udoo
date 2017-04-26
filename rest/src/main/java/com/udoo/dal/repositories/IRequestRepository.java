package com.udoo.dal.repositories;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 */
public interface IRequestRepository extends Repository<Request, Integer> {

    List<Request> findAll();

    List<Request> findAllByCategory(int category);

    @Query("SELECT o FROM Request o WHERE o.category = :category AND (o.description LIKE CONCAT('%',:searchText,'%') OR o.title LIKE CONCAT('%',:searchText,'%'))")
    List<Request> findAllMatches(@Param("category") int category,@Param("searchText") String searchText);

    List<Request> findAllByTitleContainingOrDescriptionContaining(String searchText, String seachText2);


    List<Request> findByUid(int uid);

    Request findByRid(int id);

    Request save(Request request);
}
