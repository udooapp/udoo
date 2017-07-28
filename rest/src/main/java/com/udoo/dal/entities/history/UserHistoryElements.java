package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="UserHistoryElements")
public class UserHistoryElements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int UHEID;

    private int action;

    private String changes;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "uhid")
    private UserHistory userHistory;

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

    public UserHistory getUserHistory() {
        return userHistory;
    }

    public void setUserHistory(UserHistory userHistory) {
        this.userHistory = userHistory;
    }
}
