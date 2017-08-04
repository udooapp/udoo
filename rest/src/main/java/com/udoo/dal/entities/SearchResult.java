package com.udoo.dal.entities;

import com.udoo.dal.entities.offer.OfferLite;
import com.udoo.dal.entities.request.RequestLite;

import java.util.List;

public class SearchResult {
    private List<ListElement> elementsOffer;
    private List<ListElement> elementsRequest;
    private List<OfferLite> offerLite;
    private List<RequestLite> requestLite;

    public List<ListElement> getElementsOffer() {
        return elementsOffer;
    }

    public void setElementsOffer(List<ListElement> elementsOffer) {
        this.elementsOffer = elementsOffer;
    }

    public List<ListElement> getElementsRequest() {
        return elementsRequest;
    }

    public void setElementsRequest(List<ListElement> elementsRequest) {
        this.elementsRequest = elementsRequest;
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
