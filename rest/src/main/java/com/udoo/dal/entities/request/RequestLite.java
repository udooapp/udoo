package com.udoo.dal.entities.request;


import java.util.Date;

//For maps infoWindow
public class RequestLite {
    private Integer rid;

    private String title = "";

    private String description = "";

    private String location = "";

    private String jobdate = "";

    private Date expirydate = new Date();

    private int category = -1;

    public RequestLite(){}

    public RequestLite(Request request){
        this.rid = request.getRid();
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.location = request.getLocation();
        this.jobdate = request.getJobdate();
        this.expirydate = request.getExpirydate();
        this.category = request.getCategory();
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobdate() {
        return jobdate;
    }

    public void setJobdate(String jobdate) {
        this.jobdate = jobdate;
    }

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public Integer getRid() {
        return rid;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }
}
