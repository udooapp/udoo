package com.udoo.dal.entities.message;

public class MessageRequest {

    private int uid;

    private String message;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "MessageRequest{" +
                "uid=" + uid +
                ", message='" + message + '\'' +
                '}';
    }
}
