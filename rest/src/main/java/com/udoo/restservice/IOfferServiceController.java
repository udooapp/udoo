package com.udoo.restservice;


import com.udoo.dal.entities.DeleteService;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.offer.OfferSave;
import com.udoo.dal.entities.offer.PicturesOffer;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.List;

public interface IOfferServiceController {

    ResponseEntity<?> createOffer(ServletRequest req, String src);

    ResponseEntity<?> uploadImage(ServletRequest req, PicturesOffer image);

    ResponseEntity<String> saveOffer(ServletRequest req, OfferSave save);

    ResponseEntity<String> deleteUserOffer(ServletRequest req, DeleteService service);

    ResponseEntity<List<Offer>> getAllUserOffer(ServletRequest request, int count, int last);

    ResponseEntity<?> getOffer(int id);
    ResponseEntity<?> getOfferData(int id);

}
