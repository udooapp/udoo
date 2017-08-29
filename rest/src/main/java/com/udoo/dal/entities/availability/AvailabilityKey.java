package com.udoo.dal.entities.availability;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class AvailabilityKey implements Serializable {

    private int oid;

    private int from;

    private int to;

    private int day;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AvailabilityKey that = (AvailabilityKey) o;

        if (oid != that.oid) return false;
        if (from != that.from) return false;
        if (to != that.to) return false;
        return day == that.day;
    }

    @Override
    public int hashCode() {
        int result = oid;
        result = 31 * result + from;
        result = 31 * result + to;
        result = 31 * result + day;
        return result;
    }
}
