package com.udoo.dal.entities.history;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "UserHistory")
public class UserHistory {

    @Id
    private int uhid;

    private int uid;

    private Date date;

    private int action;


    public int getUhid() {
        return uhid;
    }

    public void setUhid(int uhid) {
        this.uhid = uhid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }
}
