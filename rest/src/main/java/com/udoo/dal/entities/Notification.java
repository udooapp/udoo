package com.udoo.dal.entities;


import javax.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer nid;

    private int uid;

    private int type;

    private int id;

    private boolean checked;

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "nid=" + nid +
                ", uid=" + uid +
                ", type=" + type +
                ", id=" + id +
                ", checked=" + checked +
                '}';
    }
}
