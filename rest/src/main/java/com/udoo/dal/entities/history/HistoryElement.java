package com.udoo.dal.entities.history;


import javax.persistence.*;

@Entity
@Table(name="HistoryElements")
public class HistoryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int HEID;

    private int action;

    private String before;

    private String after;

    private int hid = -1;

    public int getHEID() {
        return HEID;
    }

    public void setHEID(int HEID) {
        this.HEID = HEID;
    }

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }

    public String getBefore() {
        return before;
    }

    public void setBefore(String before) {
        this.before = before;
    }

    public String getAfter() {
        return after;
    }

    public void setAfter(String after) {
        this.after = after;
    }


    public int getHid() {
        return hid;
    }

    public void setHid(int hid) {
        this.hid = hid;
    }


}
