package com.udoo.dal.repositories;

import com.udoo.dal.entities.User;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */

public interface IUserRepository extends Repository<User, Integer> {

    User save(User user);

    List<User> findAll();

    User findByUid(int id);

    User getByEmail(String email);

    List<User> findByName(String name);

    List<User> findByEmail(String email);

}
