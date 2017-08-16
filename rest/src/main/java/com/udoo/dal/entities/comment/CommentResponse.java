package com.udoo.dal.entities.comment;

import java.util.Date;

/**
 */
public class CommentResponse {
    private int uid;

    private String commentMessage;

    private String name;

    private String picture;
    private Date date;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getCommentMessage() {
        return commentMessage;
    }

    public void setCommentMessage(String commentMessage) {
        this.commentMessage = commentMessage;
    }

    @Override
    public String toString() {
        return "CommentResponse{" +
                "uid=" + uid +
                ", commentMessage='" + commentMessage + '\'' +
                '}';
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
