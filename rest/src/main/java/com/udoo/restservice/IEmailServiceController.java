package com.udoo.restservice;


import org.springframework.http.ResponseEntity;

/**
 */
public interface IEmailServiceController {


    ResponseEntity<String> sendTestMail();

    ResponseEntity<String> sendPasswordReminder(String email);

    ResponseEntity<String> sendMessage();

    ResponseEntity<String> changePassword(String data);

    ResponseEntity<String> checkReminder(String token);

}
