package com.udoo.dal.entities;

import com.udoo.dal.entities.offer.OfferMap;
import com.udoo.dal.entities.request.RequestMap;

import java.util.List;

public class SearchResult {
    private List<ListElement> elementsOffer;
    private List<ListElement> elementsRequest;
    private List<OfferMap> offerLite;
    private List<RequestMap> requestLite;

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


    public List<OfferMap> getOfferLite() {
        return offerLite;
    }

    public void setOfferLite(List<OfferMap> offerLite) {
        this.offerLite = offerLite;
    }

    public List<RequestMap> getRequestLite() {
        return requestLite;
    }

    public void setRequestLite(List<RequestMap> requestLite) {
        this.requestLite = requestLite;
    }
}
