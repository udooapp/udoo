package com.udoo.dal.entities.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "request")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rid;

    private Integer uid;

    private String title = "";

    private String description = "";

    private String location = "";

    private String jobdate = "";

    private Date expirydate = new Date();

    private int category = -1;

    private String image = "";

    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "request",cascade = CascadeType.PERSIST)
    private Set<PicturesRequest> picturesRequest;

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

    public String getJobdate() {
        return jobdate;
    }

    public void setJobdate(String jobdate) {
        this.jobdate = jobdate;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Set<PicturesRequest> getPicturesRequest() {
        return picturesRequest;
    }

    public void setPicturesRequest(Set<PicturesRequest> picturesRequest) {
        this.picturesRequest = picturesRequest;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }
}
