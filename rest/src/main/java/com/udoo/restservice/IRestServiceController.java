package com.udoo.restservice;


import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    String getUserName(final Integer id);
}
