package com.udoo.dal.entities.request;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 */
@Entity
@Table(name = "picturesrequest")
public class PicturesRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int prid;

    private String src;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "rid")
    private Request request;

    public PicturesRequest(){}

    public PicturesRequest(String src) {
        this.src = src;
    }

    public int getPrid() {
        return prid;
    }

    public void setPrid(int prid) {
        this.prid = prid;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }
}
