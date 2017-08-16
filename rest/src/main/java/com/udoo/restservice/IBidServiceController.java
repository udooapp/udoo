package com.udoo.restservice;

import com.udoo.dal.entities.bid.Bid;
import com.udoo.dal.entities.category.CategoryResult;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IBidServiceController {

    ResponseEntity<?> saveBid(ServletRequest req, Bid bid);

    ResponseEntity<?> saveResponseBid(ServletRequest req, CategoryResult bid);

    ResponseEntity<?> getUserBids(ServletRequest req, int count, int last);

    ResponseEntity<?> deleteBid(ServletRequest req, long bid);

    ResponseEntity<?> confirmBid(ServletRequest req, int bid);

    ResponseEntity<?> sendMoney(ServletRequest req, int bid);

    ResponseEntity<?> sendReminder(ServletRequest req, int bid);

    ResponseEntity<?> sendBackMoney(ServletRequest req, int bid);

}
