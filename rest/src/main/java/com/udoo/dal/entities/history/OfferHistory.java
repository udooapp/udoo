package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name="OfferHistory")
public class OfferHistory {
    @Id
    @JsonIgnore
    private int ohid;

    private int oid;

    private String changes;

    private Date date;

    private int action;

    public int getOhid() {
        return ohid;
    }

    public void setOhid(int ohid) {
        this.ohid = ohid;
    }

    public int getOid() {
        return oid;
    }

    public void setOid(int oid) {
        this.oid = oid;
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
