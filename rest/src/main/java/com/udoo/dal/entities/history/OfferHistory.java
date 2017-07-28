package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="OfferHistory")
public class OfferHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ohid;

    private int oid;

    private Date date;

    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "offerHistory",cascade = CascadeType.PERSIST)
    private List<OfferHistoryElements> offerHistoryElements;
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


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<OfferHistoryElements> getOfferHistoryElements() {
        return offerHistoryElements;
    }

    public void setOfferHistoryElements(List<OfferHistoryElements> offerHistoryElements) {
        this.offerHistoryElements = offerHistoryElements;
    }

    @Override
    public String toString() {
        return "OfferHistory{" +
                "ohid=" + ohid +
                ", oid=" + oid +
                ", date=" + date +
                ", offerHistoryElements=" + offerHistoryElements +
                '}';
    }
}
