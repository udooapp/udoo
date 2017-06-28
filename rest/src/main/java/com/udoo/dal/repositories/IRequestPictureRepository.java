package com.udoo.dal.repositories;


import com.udoo.dal.entities.request.RequestPictures;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IRequestPictureRepository extends Repository<RequestPictures, Integer> {


    RequestPictures save(RequestPictures request);

    RequestPictures findByPrid(int prid);

    List<RequestPictures> findAllByRid(int rid);

    @Modifying
    @Transactional
    int deleteByPrid(int prid);

    @Modifying
    @Transactional
    int deleteAllByRid(int rid);
}
