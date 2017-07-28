package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name="OfferHistoryElements")
public class OfferHistoryElements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int OHEID;

    private int action;

    private String changes;

    @JsonBackReference
    @ManyToOne(optional = false, fetch=FetchType.LAZY)
    @JoinColumn(name = "ohid")
    private OfferHistory offerHistory;

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

    public OfferHistory getOfferHistory() {
        return offerHistory;
    }

    public void setOfferHistory(OfferHistory offerHistory) {
        this.offerHistory = offerHistory;
    }
}
