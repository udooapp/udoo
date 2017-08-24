package com.udoo.dal.entities.offer;

import com.udoo.dal.entities.comment.CommentResponse;
import com.udoo.dal.entities.user.User;

import java.util.List;

public class OfferResponse {
    private Offer offer;
    private User user;
    private List<CommentResponse> comments;
    private boolean bookmark = false;

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
        if(user != null) {
            this.user = user.toUserLite();
        }
    }

    public boolean isBookmark() {
        return bookmark;
    }

    public void setBookmark(boolean bookmark) {
        this.bookmark = bookmark;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
}
