package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="history")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int hid;

    private int tid;
    private int type;
    private Date date;

    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "history", cascade = CascadeType.PERSIST)
    private List<HistoryElements> historyElements;

    public int getTid() {
        return tid;
    }

    public void setTid(int tid) {
        this.tid = tid;
    }


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<HistoryElements> getHistoryElements() {
        return historyElements;
    }

    public void setHid(int hid) {
        this.hid = hid;
    }

    public void setHistoryElements(List<HistoryElements> historyElements) {
        this.historyElements = historyElements;
    }

    public int getHid() {
        return hid;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

}
