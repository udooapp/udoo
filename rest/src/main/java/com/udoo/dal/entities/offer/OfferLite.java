package com.udoo.dal.entities.offer;


import java.util.Date;

//for maps InfoWindow
public class OfferLite {
    private Integer oid;

    private String title = "";

    private String description = "";

    private int category = -1;

    private String location = "";

    private String availability = "";

    private Date expirydate = new Date();

    private boolean realTime;

    public OfferLite(){}

    public OfferLite(Offer offer){
        this.oid = offer.getOid();
        this.title = offer.getTitle();
        this.description = offer.getDescription();
        this.category = offer.getCategory();
        this.location = offer.getLocation();
        this.availability = offer.getAvailability();
        this.expirydate = offer.getExpirydate();
        this.realTime = offer.isRealTime();
    }

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
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


    public boolean isRealTime() {
        return realTime;
    }

    public void setRealTime(boolean realTime) {
        this.realTime = realTime;
    }

    @Override
    public String toString() {
        return "Offer{" +
                "oid=" + oid +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", category=" + category +
                ", location='" + location + '\'' +
                ", availability='" + availability + '\'' +
                ", expirydate=" + expirydate +
                ", realTime=" + realTime +
                '}';
    }
}
