package com.udoo.dal.entities.contact;


import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class ContactID implements Serializable{
    private int uid;
    private int cid;

    public ContactID() {
        this.uid = -1;
        this.cid = -1;
    }
    public ContactID(int uid, int cid){
        this.uid = uid;
        this.cid = cid;
    }

    public int getCid() {
        return cid;
    }

    public void setCid(int cid) {
        this.cid = cid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ContactID contactID = (ContactID) o;

        if (uid != contactID.uid) return false;
        return cid == contactID.cid;
    }

    @Override
    public int hashCode() {
        int result = uid;
        result = 31 * result + cid;
        return result;
    }
}
