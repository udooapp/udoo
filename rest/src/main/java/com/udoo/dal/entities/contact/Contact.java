package com.udoo.dal.entities.contact;

import javax.persistence.*;

/**
 *
 */
@Entity
@Table(name = "contacts")
@IdClass(ContactID.class)
public class Contact {

    @Id
    private int uid;

    @Id
    private int cid;

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
