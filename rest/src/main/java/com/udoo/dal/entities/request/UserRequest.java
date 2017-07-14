package com.udoo.dal.entities.request;

import com.udoo.dal.entities.Bid;
import com.udoo.dal.entities.Category;
import com.udoo.dal.entities.offer.Offer;

import java.util.List;

/**
 * Created by Zoltan on 7/14/2017.
 */
public class UserRequest
{
    private Request request;
    private List<Bid> bids;
    private List<Category> categories;

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
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
