package com.udoo.dal.repositories;

import com.udoo.dal.entities.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 */
public interface IUserRepository extends Repository<User, Integer> {

    User save(User user);

    List<User> findAll();

    User findByUid(int id);

    List<User> findByName(String name);

    List<User> findByEmail(String email);

}
