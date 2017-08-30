package com.udoo.dal.entities.user;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer uid = -1;

    private String name = "";

    private String email = "";

    @JsonIgnore
    private String password = "";

    private String phone = "";

    private String picture = "";

    private Integer type = 0;

    private float stars = 0;

    private String birthdate = "";

    private String location = "";

    private String language = "";

    private int active = 0;

    private long facebookid = 0;

    private String googleid = "";

    public User(){
    }

    public User(UserRegistration userRegistration){
        this.uid = userRegistration.getUid();
        this.name = userRegistration.getName();
        this.email = userRegistration.getEmail();
        this.phone = userRegistration.getPhone();
        this.picture = userRegistration.getPicture();
        this.password = userRegistration.getPassword();
        this.type = userRegistration.getType();
        this.birthdate = userRegistration.getBirthdate();
        this.language = "en";
        this.facebookid = userRegistration.getFacebookid();
        this.googleid = userRegistration.getGoogleid();
    }

    public int getUid() {
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

    public long getFacebookid() {
        return facebookid;
    }

    public void setFacebookid(long socialId) {
        this.facebookid = socialId;
    }

    public String getGoogleid() {
        return googleid;
    }

    public void setGoogleid(String googleid) {
        this.googleid = googleid;
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
    public User toUserLite(){
        User newUser = new User();
        newUser.setUid(uid);
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setPicture(picture);
        newUser.setType(type);
        newUser.setStars(stars);
        return newUser;
    }
}
