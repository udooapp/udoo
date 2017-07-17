package com.udoo.restservice;

import com.udoo.dal.entities.Bid;
import com.udoo.dal.entities.CategoryResult;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IBidServiceController {

    ResponseEntity<?> saveBid(ServletRequest req, Bid bid);

    ResponseEntity<?> saveResponseBid(ServletRequest req, CategoryResult bid);

    ResponseEntity<?> getUserBids(ServletRequest req, int count, int last);

    ResponseEntity<?> getProviderBids(ServletRequest req, int count, int last);

    ResponseEntity<?> deleteBid(ServletRequest req, long bid);

    ResponseEntity<?> confirmBid(ServletRequest req, int bid);


}
