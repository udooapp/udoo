package com.udoo.dal.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "offer")
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oid;

    private Integer uid;

    private String title;

    private String description;

    private int category;

    private String location;

    private String availability;

    private Date expirydate;

    private String image;

    private boolean realTime;

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public Integer getUid() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isRealTime() {
        return realTime;
    }

    public void setRealTime(boolean realTime) {
        this.realTime = realTime;
    }

    @Override
    public String toString() {
        return "Offer{" +
                "oid:" + oid +
                ", uid:" + uid +
                ", title:'" + title + '\'' +
                ", description:'" + description + '\'' +
                ", category:" + category +
                ", location:'" + location + '\'' +
                ", availability:'" + availability + '\'' +
                ", expirydate:" + expirydate +
                ", image:'" + image + '\'' +
                ", realTime:" + realTime + +
                '}';
    }
}
