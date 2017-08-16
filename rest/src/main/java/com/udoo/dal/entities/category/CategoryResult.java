package com.udoo.dal.entities.category;


public class CategoryResult {
    private int id;
    private long result;

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
