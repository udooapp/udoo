package com.udoo.dal.entities.request;



import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "request")
public class RequestLite {
    @Id
    private Integer rid;

    private Integer uid;

    private String title = "";

    private String description = "";

    private String location = "";

    private Date expirydate = new Date();

    private int category = -1;

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

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public Integer getRid() {
        return rid;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }


    public void setRid(Integer rid) {
        this.rid = rid;
    }

}
