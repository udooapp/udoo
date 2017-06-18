package com.udoo.dal.entities;

import javax.persistence.*;
import java.util.Date;

/**
 */
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer uid;

    private String name;

    private String email;

    private String password;

    private String phone;

    private String picture;

    private Integer type;

    private float stars;

    private String birthdate;

    private String location;

    private String language;

    private int active;

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public float getStars() {
        return stars;
    }

    public void setStars(Float stars) {
        this.stars = stars;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public void setStars(float stars) {
        this.stars = stars;
    }

    public String getLocation() {
        return location;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getActive() {
        return active;
    }

    public void setActive(int active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "{" +
                "\"uid\":" + uid +
                ", \"name\":\"" + name + '\"' +
                ", \"email\":\"" + email + '\"' +
                ", \"password\":\"" + password + '\"' +
                ", \"phone\":\"" + phone + '\"' +
                ", \"picture\":\"" + picture + '\"' +
                ", \"type\":" + type +
                ", \"stars\":" + stars +
                ", \"birthdate\":" + (birthdate == null ? null : ("\"" + birthdate + "\"")) +
                ", \"language\":\"" + language + "\"" +
                ", \"active\":" + active +
                '}';
    }
}
