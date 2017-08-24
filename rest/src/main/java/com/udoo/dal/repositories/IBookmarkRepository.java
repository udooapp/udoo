package com.udoo.dal.repositories;

import com.udoo.dal.entities.bookmkark.Bookmark;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface IBookmarkRepository extends Repository<Bookmark, Integer> {

    List<Bookmark> findAllByUid(int uid, Pageable page);

    Bookmark save(Bookmark reminder);

    Bookmark findByUidAndSidAndType(int uid, int sid, boolean type);

    @Modifying
    @Transactional
    @Query("delete from Bookmark b where b.uid= :uid and b.sid= :sid and b.type = :tp")
    int deleteByUidAndSidAndType(@Param("uid") int uid, @Param("sid") int sid, @Param("tp") boolean type);

    @Modifying
    @Transactional
    @Query("delete from Bookmark b where b.sid= :sid and b.type = :tp")
    int deleteBySidAndType(@Param("sid") int sid, @Param("tp") boolean type);
}
