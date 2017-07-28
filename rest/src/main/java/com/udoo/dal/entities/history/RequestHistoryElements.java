package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="RequestHistoryElements")
public class RequestHistoryElements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int RHEID;

    private int action;

    private String changes;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "rhid")
    private RequestHistory requestHistory;

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

    public RequestHistory getRequestHistory() {
        return requestHistory;
    }

    public void setRequestHistory(RequestHistory requestHistory) {
        this.requestHistory = requestHistory;
    }
}
