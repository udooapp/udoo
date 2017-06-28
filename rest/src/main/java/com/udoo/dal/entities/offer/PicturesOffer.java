package com.udoo.dal.entities.offer;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 */
@Entity
@Table(name="PicturesOffer")
public class PicturesOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int poid;

    private String src;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "oid")
    private Offer offer;
    public PicturesOffer(){
        src = "";
    }
    public PicturesOffer(String src) {
        this.src = src;
    }

    public int getPoid() {
        return poid;
    }

    public void setPoid(int poid) {
        this.poid = poid;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public Offer getOffer() {
        return offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
    }
}
