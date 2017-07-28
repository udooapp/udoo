package com.udoo.restservice;


import com.udoo.dal.entities.user.User;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IUserServiceController {

    ResponseEntity<?> logoutUser(ServletRequest request);

    ResponseEntity<String> updatePassword(ServletRequest request, String req);

    ResponseEntity<String> updateUser(ServletRequest request, final User user);

    ResponseEntity<?> getUserData(ServletRequest request);

}
