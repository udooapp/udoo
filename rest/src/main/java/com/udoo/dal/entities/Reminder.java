package com.udoo.dal.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 *
 */
@Entity
@Table(name = "Reminders")
public class Reminder {
    @Id
    private int rid;

    private int uid;

    private Date expiryDate;

    private String token;

    public Reminder() {
        this.rid = -1;
        this.uid = -1;
        this.expiryDate = null;
        this.token = "";
    }

    public Reminder(int uid, String token, Date expiryDate) {
        this.uid = uid;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    public int getRid() {
        return rid;
    }

    public void setRid(int rid) {
        this.rid = rid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}