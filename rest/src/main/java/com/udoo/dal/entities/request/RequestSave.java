package com.udoo.dal.entities.request;


/**
 *
 */
public class RequestSave {
    private Request request;
    private int delete;

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public int getDelete() {
        return delete;
    }

    public void setDelete(int delete) {
        this.delete = delete;
    }
}
