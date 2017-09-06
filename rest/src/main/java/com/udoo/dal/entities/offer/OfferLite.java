package com.udoo.dal.entities.offer;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "offer")
public class OfferLite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oid = -1;

    private Integer uid;

    private String title = "";

    private int category = -1;

    private String location = "";

    private String description = "";

    private boolean realTime;

    @JsonIgnore
    private boolean completed = false;

    private Date expirydate = new Date();

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public boolean isRealTime() {
        return realTime;
    }

    public void setRealTime(boolean realTime) {
        this.realTime = realTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    @Override
    public String toString() {
        return "Offer{" +
                "oid=" + oid +
                ", uid=" + uid +
                ", title='" + title + '\'' +
                ", category=" + category +
                ", location='" + location + '\'' +
                ", realTime=" + realTime +
                '}';
    }
}
