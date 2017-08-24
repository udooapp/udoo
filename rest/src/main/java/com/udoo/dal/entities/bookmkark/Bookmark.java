package com.udoo.dal.entities.bookmkark;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name="bookmarks")
@IdClass(BookmarkKey.class)
public class Bookmark {

    @Id
    private int uid;

    @Id
    private int sid;

    @Id
    private boolean type;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isType() {
        return type;
    }

    public void setType(boolean type) {
        this.type = type;
    }
}
