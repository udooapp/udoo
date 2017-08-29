package com.udoo.dal.entities.offer;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.udoo.dal.entities.availability.Availability;
import com.udoo.dal.entities.availability.AvailabilityResponse;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "offer")
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oid = -1;

    private Integer uid;

    private String title = "";

    private String description = "";

    private int category = -1;

    private String location = "";


    private Date expirydate = new Date();

    private boolean realTime;

    @Transient
    private int bids;


    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "offer")
    private List<PicturesOffer> picturesOffer = new ArrayList<>();

    @JsonIgnore
    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "offer" )
    private List<Availability> availability = new ArrayList<>();

    @Transient
    private List<List<AvailabilityResponse>> availabilities = new ArrayList<>();

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

    public List<PicturesOffer> getPicturesOffer() {
        return picturesOffer;
    }

    public void setPicturesOffer(List<PicturesOffer> images) {
        this.picturesOffer = images;
    }

    public boolean isRealTime() {
        return realTime;
    }

    public void setRealTime(boolean realTime) {
        this.realTime = realTime;
    }

    public int getBids() {
        return bids;
    }

    public void setBids(int bids) {
        this.bids = bids;
    }

    public List<Availability> getAvailability() {
        return availability;
    }

    public void setAvailability(List<Availability> availability) {
        this.availability = availability;
    }

    public List<List<AvailabilityResponse>> getAvailabilities() {
        return availabilities;
    }

    public void setAvailabilities(List<List<AvailabilityResponse>> availabilities) {
        this.availabilities = availabilities;
    }

    @Override
    public String toString() {
        return "Offer{" +
                "oid=" + oid +
                ", uid=" + uid +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", category=" + category +
                ", location='" + location + '\'' +
                ", availability='" + availability + '\'' +
                ", expirydate=" + expirydate +
                ", picturesOffer=" + picturesOffer +
                ", realTime=" + realTime +
                '}';
    }
}
