package com.udoo.dal.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 *
 */
@Entity
@Table(name = "Verification")
public class Verification {
    @Id
    private int vid;

    private int uid;

    private Date expiryDate;

    private String token;

    private boolean type;

    public Verification() {
        this.vid = -1;
        this.uid = -1;
        this.expiryDate = null;
        this.token = "";
        this.type = false;
    }

    public Verification(int uid, String token, Date expiryDate, boolean type) {
        this.uid = uid;
        this.token = token;
        this.expiryDate = expiryDate;
        this.type = type;
    }

    public int getVid() {
        return vid;
    }

    public void setVid(int vid) {
        this.vid = vid;
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

    public boolean isType() {
        return type;
    }

    public void setType(boolean type) {
        this.type = type;
    }
}
