package com.udoo.dal.entities.history;


import javax.persistence.*;

@Entity
@Table(name="OfferHistoryElements")
public class OfferHistoryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int OHEID;

    private int action;

    private String changes;

    private int ohid = -1;

    public int getOHEID() {
        return OHEID;
    }

    public void setOHEID(int OHEID) {
        this.OHEID = OHEID;
    }

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }

    public String getChanges() {
        return changes;
    }

    public void setChanges(String changes) {
        this.changes = changes;
    }

    public int getOhid() {
        return ohid;
    }

    public void setOhid(int ohid) {
        this.ohid = ohid;
    }
}
