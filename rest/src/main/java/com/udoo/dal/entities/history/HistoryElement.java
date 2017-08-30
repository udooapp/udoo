package com.udoo.dal.entities.history;


import javax.persistence.*;

@Entity
@Table(name="historyelements")
public class HistoryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int HEID;

    private int action;

    private String beforeState;

    private String afterState;

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

    public String getBeforeState() {
        return beforeState;
    }

    public void setBeforeState(String before) {
        this.beforeState = before;
    }

    public String getAfterState() {
        return afterState;
    }

    public void setAfterState(String after) {
        this.afterState = after;
    }


    public int getHid() {
        return hid;
    }

    public void setHid(int hid) {
        this.hid = hid;
    }


}
