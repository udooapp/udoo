package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="HistoryElements")
public class HistoryElements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int HEID;

    private int action;

    private String changes;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "hid")
    private History History;

    public int getHEID() {
        return HEID;
    }

    public void setHEID(int HEID) {
        this.HEID = HEID;
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

    public com.udoo.dal.entities.history.History getHistory() {
        return History;
    }

    public void setHistory(com.udoo.dal.entities.history.History history) {
        History = history;
    }
}
