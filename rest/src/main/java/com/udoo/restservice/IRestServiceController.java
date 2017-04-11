package com.udoo.restservice;


import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    ResponseEntity<?> logoutUser(User user);

    String getUserName(final Integer id);
}
