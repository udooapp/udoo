package com.udoo.dal.entities;


import java.util.List;

/**
 *
 */
public class MoreService {
    List<ListElement> offers;
    List<ListElement> requests;

    public List<ListElement> getOffers() {
        return offers;
    }

    public void setOffers(List<ListElement> offers) {
        this.offers = offers;
    }

    public List<ListElement> getRequests() {
        return requests;
    }

    public void setRequests(List<ListElement> requests) {
        this.requests = requests;
    }
}
