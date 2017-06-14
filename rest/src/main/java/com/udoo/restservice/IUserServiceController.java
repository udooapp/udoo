package com.udoo.restservice;


import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IUserServiceController {

    ResponseEntity<?> logoutUser(ServletRequest request);

    String getUserName(final Integer id);

    ResponseEntity<String> updatePassword(ServletRequest request, String req);

    ResponseEntity<String> updateUser(ServletRequest request, final User user);

    User getUser(final String id);

    ResponseEntity<?> getUserData(ServletRequest request);

}
