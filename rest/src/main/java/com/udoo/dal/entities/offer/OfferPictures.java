package com.udoo.dal.entities.offer;


import javax.persistence.*;

/**
 */
@Entity
@Table(name = "picturesoffer")
public class OfferPictures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int poid;

    private int oid;

    private String src;

    public OfferPictures() {
        src = "";
    }

    public OfferPictures(String src, int oid) {
        this.src = src;
        this.oid = oid;
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

    public int getOid() {
        return oid;
    }

    public void setOid(int oid) {
        this.oid = oid;
    }
}
