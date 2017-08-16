package com.udoo.dal.repositories.offer;



import com.udoo.dal.entities.offer.OfferPictures;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 */
public interface IOfferPictureRepository extends Repository<OfferPictures, Integer> {


    OfferPictures save(OfferPictures offer);

    OfferPictures findByPoid(int poid);

    List<OfferPictures> findAllByOid(int oid);

    @Modifying
    @Transactional
    int deleteByPoid(int poid);

    @Modifying
    @Transactional
    int deleteAllByOid(int oid);
}
