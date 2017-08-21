package com.udoo.dal.entities.message;

import java.util.List;

public class MessageData {

    private String picture;

    private List<MessageResponse> messages;

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public List<MessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageResponse> messages) {
        this.messages = messages;
    }
}
