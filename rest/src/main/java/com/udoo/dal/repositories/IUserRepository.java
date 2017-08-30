package com.udoo.dal.repositories;

import com.udoo.dal.entities.user.User;
import org.springframework.data.repository.Repository;

import java.util.List;

/**
 */

public interface IUserRepository extends Repository<User, Integer> {

    User save(User user);

    List<User> findAll();

    User findByUid(int id);

    User getByEmail(String email);

    User getByFacebookid(long id);

    User getByGoogleid(String id);

    List<User> findByName(String name);

    List<User> findByEmail(String email);

}
