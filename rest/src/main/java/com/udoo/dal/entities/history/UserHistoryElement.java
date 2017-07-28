package com.udoo.dal.entities.history;


import javax.persistence.*;

@Entity
@Table(name="UserHistoryElements")
public class UserHistoryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int UHEID;

    private int action;

    private String changes;

    private int uhid;

    public int getUHEID() {
        return UHEID;
    }

    public void setUHEID(int UHEID) {
        this.UHEID = UHEID;
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

    public int getUhid() {
        return uhid;
    }

    public void setUhid(int uhid) {
        this.uhid = uhid;
    }
}
