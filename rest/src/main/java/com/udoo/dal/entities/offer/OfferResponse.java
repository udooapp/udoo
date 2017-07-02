package com.udoo.dal.entities.offer;

import com.udoo.dal.entities.CommentResponse;
import com.udoo.dal.entities.User;

import java.util.List;

public class OfferResponse {
    private Offer offer;
    private User user;
    private List<CommentResponse> comments;

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
}
