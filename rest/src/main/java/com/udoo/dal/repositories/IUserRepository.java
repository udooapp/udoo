package com.udoo.dal.repositories;

import com.udoo.dal.entities.User;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */
public interface IUserRepository extends Repository<User, Integer> {

    User save(User user);

    List<User> findAll();

    List<User> findByName(String name);

    List<String> findByEmail(String email);
}
