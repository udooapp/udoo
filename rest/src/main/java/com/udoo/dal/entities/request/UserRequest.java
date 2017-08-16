package com.udoo.dal.entities.request;

import com.udoo.dal.entities.bid.Bid;
import com.udoo.dal.entities.category.Category;

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
