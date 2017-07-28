package com.udoo.dal.entities.request;


import com.udoo.dal.entities.CommentResponse;
import com.udoo.dal.entities.user.User;

import java.util.List;


public class RequestResponse {
    private Request request;
    private User user;
    private List<CommentResponse> comments;

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        if(user!= null) {
            this.user = user.toUserLite();
        }
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
}
