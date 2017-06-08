package com.udoo.restservice;


import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IEmailServiceController {

    ResponseEntity<String> sendPasswordReminder(String email);

    ResponseEntity<String> sendMessage();

    ResponseEntity<String> changePassword(String data);

    ResponseEntity<String> checkReminder(String token);

    ResponseEntity<String> sendEmailVerification(String email);

    ResponseEntity<String> checkVerification(String token);

    ResponseEntity<String> checkUserVerification(ServletRequest request);

}
