package com.udoo.dal.entities.offer;

/**
 *
 */
public class OfferSave {
    private Offer offer;
    private int delete;

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public int getDelete() {
        return delete;
    }

    public void setDelete(int delete) {
        this.delete = delete;
    }
}
