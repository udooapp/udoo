package com.udoo.dal.entities.availability;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.udoo.dal.entities.offer.Offer;

import javax.persistence.*;

@Entity
@Table(name = "availability")
@IdClass(AvailabilityKey.class)
public class Availability {

    @Id
    private int oid;

    @Id
    private int day;

    @Id
    @Column(name="`from`")
    private int from;

    @Id
    @Column(name="`to`")
    private int to;

    public Availability() {
    }

    public Availability(int oid, int day, int from, int to) {
        this.oid = oid;
        this.day = day;
        this.from = from;
        this.to = to;
    }

    public int getOid() {
        return oid;
    }

    public void setOid(int oid) {
        this.oid = oid;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

//@EmbeddedId
    //private AvailabilityKey id;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "oid", insertable = false, updatable = false)
    private Offer offer;

//    public AvailabilityKey getId() {
//        return id;
//    }
//
//    public void setId(AvailabilityKey id) {
//        this.id = id;
//    }

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }
}
