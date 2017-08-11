package com.udoo.dal.entities.request;


//For maps infoWindow
public class RequestMap {
    private Integer rid;

    private String location = "";

    public RequestMap(Request request) {
        this.rid = request.getRid();
        this.location = request.getLocation();
    }
    public RequestMap(RequestLite request) {
        this.rid = request.getRid();
        this.location = request.getLocation();
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getRid() {
        return rid;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }
}
