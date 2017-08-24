package com.udoo.dal.entities.bookmkark;

public class BookmarkRequest {
    private int sid;

    private boolean type;

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isType() {
        return type;
    }

    public void setType(boolean type) {
        this.type = type;
    }
}
