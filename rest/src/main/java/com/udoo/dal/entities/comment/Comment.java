package com.udoo.dal.entities.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.Date;

/**
 */
@Entity
@Table(name="comments")
public class Comment implements Serializable{

    @Id
    @JsonIgnore
    private long cid;

    private long uid;

    private Date creatingdate;

    private boolean type;

    private long sid;


    private String comment;

    public long getUid() {
        return uid;
    }

    public void setUid(long uid) {
        this.uid = uid;
    }

    public Date getDate() {
        return creatingdate;
    }

    public void setDate(Date date) {
        this.creatingdate = date;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isType() {
        return type;
    }

    public void setType(boolean type) {
        this.type = type;
    }

    public long getSid() {
        return sid;
    }



    public void setSid(long sid) {
        this.sid = sid;
    }



    @Override
    public String toString() {
        return "Comment{" +
                "cid=" + cid +
                ", uid=" + uid +
                ", creatingdate=" + creatingdate +
                ", type=" + type +
                ", sid=" + sid +
                ", comment='" + comment + '\'' +
                '}';
    }
}
