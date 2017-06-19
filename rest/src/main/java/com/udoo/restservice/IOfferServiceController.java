package com.udoo.restservice;


import com.udoo.dal.entities.Offer;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.List;

public interface IOfferServiceController {

    ResponseEntity<String> saveOffer(ServletRequest req, Offer offer);

    ResponseEntity<String> deleteUserOffer(ServletRequest req, String request);

    ResponseEntity<List<Offer>> getAllUserOffer(ServletRequest request);

    ResponseEntity<Offer> getOffer(int uid);

}
