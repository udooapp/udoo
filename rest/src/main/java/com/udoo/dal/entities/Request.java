package com.udoo.dal.entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "request")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rid;

    private Integer uid;

    private String title;

    private String description;

    private String location;

    private String jobdate;

    private Date expirydate;

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

    @Override
    public String toString() {
        return "{" +
                "rid=" + rid +
                ", uid=" + uid +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", jobdate='" + jobdate + '\'' +
                ", expirydate=" + expirydate +
                '}';
    }
}
