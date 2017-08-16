package com.udoo.dal.entities.offer;

import com.udoo.dal.entities.bid.Bid;
import com.udoo.dal.entities.category.Category;

import java.util.List;

/**
 * Created by Zoltan on 7/14/2017.
 */
public class UserOffer
{
    private Offer offer;

    private List<Bid> bids;

    private List<Category> categories;

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public List<Bid> getBids() {
        return bids;
    }

    public void setBids(List<Bid> bids) {
        this.bids = bids;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
