package com.udoo.dal.entities;

import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;

import java.util.List;

/**
 *
 */
public class MoreService {
    List<Offer> offers;
    List<Request> requests;

    public List<Offer> getOffers() {
        return offers;
    }

    public void setOffers(List<Offer> offers) {
        this.offers = offers;
    }

    public List<Request> getRequests() {
        return requests;
    }

    public void setRequests(List<Request> requests) {
        this.requests = requests;
    }
}
