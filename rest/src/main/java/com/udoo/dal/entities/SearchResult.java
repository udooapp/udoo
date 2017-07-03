package com.udoo.dal.entities;

import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.offer.OfferLite;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.entities.request.RequestLite;

import java.util.List;

public class SearchResult {
    private List<Offer> offer;
    private List<OfferLite> offerLite;
    private List<RequestLite> requestLite;
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

    public List<OfferLite> getOfferLite() {
        return offerLite;
    }

    public void setOfferLite(List<OfferLite> offerLite) {
        this.offerLite = offerLite;
    }

    public List<RequestLite> getRequestLite() {
        return requestLite;
    }

    public void setRequestLite(List<RequestLite> requestLite) {
        this.requestLite = requestLite;
    }
}
