package com.udoo.dal.entities;

import javax.persistence.*;

/**
 *
 */
@Entity
@Table(name = "Contacts")
@IdClass(ContactID.class)
public class Contact {

    @Id
    int uid;
    @Id
    int cid;

    public Contact() {
    }

    public Contact(int uid, int cid) {
        this.uid = uid;
        this.cid = cid;
    }

    public int getCid() {
        return cid;
    }
}
