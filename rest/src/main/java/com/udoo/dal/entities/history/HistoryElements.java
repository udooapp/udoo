package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="historyelements")
public class HistoryElements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int HEID;

    private int action;

    private String beforeState;

    private String afterState;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "hid")
    private History history;

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

    public String getBeforeState() {
        return beforeState;
    }

    public void setBeforeState(String before) {
        this.beforeState = before;
    }

    public String getAfterState() {
        return afterState;
    }

    public void setAfterState(String after) {
        this.afterState = after;
    }

    public com.udoo.dal.entities.history.History getHistory() {
        return history;
    }

    public void setHistory(com.udoo.dal.entities.history.History history) {
        history = history;
    }
}
