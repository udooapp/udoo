package com.udoo.dal.entities;

import java.util.List;

/**
 */
public class UserResponse {
    private User user;
    private List<BidResult> bids;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<BidResult> getBids() {
        return bids;
    }

    public void setBids(List<BidResult> bids) {
        this.bids = bids;
    }

}
