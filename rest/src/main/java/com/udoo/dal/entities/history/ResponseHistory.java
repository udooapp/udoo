package com.udoo.dal.entities.history;

import com.udoo.dal.entities.WallContent;

import java.util.Date;
import java.util.List;

public class ResponseHistory {
    private int id;
    private int type;
    private String userName;
    private Date date;
    private String picture;
    private String serviceName;
    private List<WallContent> content;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<WallContent> getContent() {
        return content;
    }

    public void setContent(List<WallContent> content) {
        this.content = content;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}
