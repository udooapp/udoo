package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="RequestHistoryElements")
public class RequestHistoryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int RHEID;

    private int action;

    private String changes;

    private int rhid = -1;

    public int getRHEID() {
        return RHEID;
    }

    public void setRHEID(int RHEID) {
        this.RHEID = RHEID;
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

    public int getRhid() {
        return rhid;
    }

    public void setRhid(int rhid) {
        this.rhid = rhid;
    }
}
