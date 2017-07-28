package com.udoo.dal.entities.history;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "UserHistory")
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uhid;

    private int uid;

    private Date date;

    @JsonManagedReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "userHistory",cascade = CascadeType.PERSIST)
    private List<UserHistoryElements> userHistoryElements;


    public int getUhid() {
        return uhid;
    }

    public void setUhid(int uhid) {
        this.uhid = uhid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<UserHistoryElements> getUserHistoryElements() {
        return userHistoryElements;
    }

    public void setUserHistoryElements(List<UserHistoryElements> userHistoryElements) {
        this.userHistoryElements = userHistoryElements;
    }
}
