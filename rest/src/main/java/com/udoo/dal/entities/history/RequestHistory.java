package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name="RequestHistory")
public class RequestHistory{
    @Id
    @JsonIgnore
    private int rhid;

    private int rid;

    private String changes;

    private Date date;

    private int action;


    public int getRhid() {
        return rhid;
    }

    public void setRhid(int rhid) {
        this.rhid = rhid;
    }

    public int getRid() {
        return rid;
    }

    public void setRid(int rid) {
        this.rid = rid;
    }

    public String getChanges() {
        return changes;
    }

    public void setChanges(String changes) {
        this.changes = changes;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }


    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }
}
