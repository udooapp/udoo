package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="RequestHistory")
public class RequestHistory{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rhid;

    private int rid;

    private Date date;

    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "requestHistory",cascade = CascadeType.PERSIST)
    private List<RequestHistoryElements> requestHistoryElements;

    public int getRhid() {
        return rhid;
    }

    public void setRhid(int rhid) {
        this.rhid = rhid;
    }

    public int getRid() {
        return rid;
    }

    public void setRid(int rid) {
        this.rid = rid;
    }


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<RequestHistoryElements> getRequestHistoryElements() {
        return requestHistoryElements;
    }

    public void setRequestHistoryElements(List<RequestHistoryElements> requestHistoryElements) {
        this.requestHistoryElements = requestHistoryElements;
    }
}
