package com.udoo.dal.repositories;

import com.udoo.dal.entities.availability.Availability;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface IAvailabilityRepository extends Repository<Availability, Integer> {

    Availability save(Availability availability);

    List<Availability> findAllByOidOrderByDayAscFromAsc(int oid);

    @Modifying
    @Transactional
    @Query("DELETE FROM Availability a WHERE a.oid= :oid AND a.day = :day AND a.from = :from AND a.to = :to")
    int deleteByOidAndDayAndFromAndTo(@Param("oid") int bid, @Param("day") int day, @Param("from") int from, @Param("to") int to);

    @Modifying
    @Transactional
    @Query("DELETE FROM Availability a WHERE a.oid= :oid")
    int deleteByOid(@Param("oid") int bid);
}
