package com.udoo.dal.entities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.Calendar;
import java.util.Date;

/**
 *
 */
@Entity
@Table(name = "Tokens")
public class Token {

    //   @Autowired
    //   Environment env;

    @Id
    private String token;

    private int uid;

    private Date expirydate;

    private boolean disable;
    public Token() {
    }

    public Token(int uid, String token, Date date, boolean disable) {
        this.uid = uid;
        this.token = token;
        this.expirydate = new Date();
        this.expirydate = date;
        this.disable = disable;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public Date getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(Date expirydate) {
        this.expirydate = expirydate;
    }

    public boolean isDisable() {
        return disable;
    }

    public void setDisable(boolean disable) {
        this.disable = disable;
    }


    @Override
    public String toString() {
        return "Token{" +
                "token='" + token + '\'' +
                ", uid=" + uid +
                ", expirydate=" + expirydate +
                ", disable=" + disable +
                '}';
    }
}
