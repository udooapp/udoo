package com.udoo.dal.entities;

import java.util.List;

/**
 */
public class UserResponse {
    private User user;
    private List<BidResult> bids;
    private List<BidResult> reminders;

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

    public List<BidResult> getReminders() {
        return reminders;
    }

    public void setReminders(List<BidResult> reminders) {
        this.reminders = reminders;
    }
}
