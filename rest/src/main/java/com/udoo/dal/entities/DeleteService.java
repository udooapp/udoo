package com.udoo.dal.entities;

/**
 */
public class DeleteService {
    int id;
    int delete;

    public DeleteService(){}

    public DeleteService(int id, int delete){
        this.id=id;
        this.delete = delete;
    }

    public int getId() {
        return id;
    }

    public int getDelete() {
        return delete;
    }
}
