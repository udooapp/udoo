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

    private String before;
    private String after;

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

    public String getBefore() {
        return before;
    }

    public void setBefore(String before) {
        this.before = before;
    }

    public String getAfter() {
        return after;
    }

    public void setAfter(String after) {
        this.after = after;
    }

    public com.udoo.dal.entities.history.History getHistory() {
        return History;
    }

    public void setHistory(com.udoo.dal.entities.history.History history) {
        History = history;
    }
}
