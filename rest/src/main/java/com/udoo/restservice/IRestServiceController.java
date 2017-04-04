package com.udoo.restservice;


import org.springframework.http.ResponseEntity;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(String name);

    String getUserName(final Integer id);
}
