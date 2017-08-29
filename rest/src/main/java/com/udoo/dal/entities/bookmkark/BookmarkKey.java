package com.udoo.dal.entities.bookmkark;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class BookmarkKey implements Serializable {

    private int uid;

    private int sid;

    private boolean type;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BookmarkKey that = (BookmarkKey) o;

        if (uid != that.uid) return false;
        if (sid != that.sid) return false;
        return type == that.type;
    }

    @Override
    public int hashCode() {
        int result = uid;
        result = 31 * result + sid;
        result = 31 * result + (type ? 1 : 0);
        return result;
    }
}
