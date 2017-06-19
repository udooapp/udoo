package com.udoo.dal.entities;


public class CategoryResult {
    int id;
    long result;

    public void setId(int id) {
        this.id = id;
    }

    public void setResult(long result) {
        this.result = result;
    }

    public int getId() {
        return id;
    }

    public long getResult() {
        return result;
    }

    @Override
    public String toString() {
        return "CategoryResult{" +
                "id=" + id +
                ", result=" + result +
                '}';
    }
}
