package com.udoo.dal.entities;

import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;

import java.util.List;

public class SearchResult {
    private List<Offer> offer;
    private List<Request> request;

    public List<Offer> getOffer() {
        return offer;
    }

    public void setOffer(List<Offer> offer) {
        this.offer = offer;
    }

    public List<Request> getRequest() {
        return request;
    }

    public void setRequest(List<Request> request) {
        this.request = request;
    }
}
