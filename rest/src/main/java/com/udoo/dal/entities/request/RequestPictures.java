package com.udoo.dal.entities.request;

import javax.persistence.*;

/**
 */
@Entity
@Table(name = "PicturesRequest")
public class RequestPictures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int prid;

    private int rid;

    private String src;

    public RequestPictures() {
        src = "";
    }

    public RequestPictures(String src, int oid) {
        this.src = src;
        this.rid = oid;
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

    public int getRid() {
        return rid;
    }

    public void setRid(int rid) {
        this.rid = rid;
    }
}
