package com.udoo.restservice;


import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletRequest;

/**
 */
public interface IEmailServiceController {

    ResponseEntity<String> sendPasswordReminder(String email);

    ResponseEntity<String> sendMessage();

    ResponseEntity<String> changePassword(String data);

    ResponseEntity<String> checkReminder(String token);

    ResponseEntity<String> sendEmailVerification(ServletRequest request);

    ResponseEntity<String> sendSmsVerification(ServletRequest request);

    ResponseEntity<String> checkEmailVerification(String token);
    ResponseEntity<String> checkSmsVerification(String token);

    ResponseEntity<String> checkUserVerification(ServletRequest request);

    ModelAndView activateEmail(String token);
}
