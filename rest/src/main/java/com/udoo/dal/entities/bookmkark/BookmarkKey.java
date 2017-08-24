package com.udoo.dal.entities.bookmkark;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class BookmarkKey implements Serializable {

    private int uid;

    private int sid;

    private boolean type;
}
