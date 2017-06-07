package com.udoo.restservice;


import org.json.JSONException;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

public interface IContactServiceController {

    ResponseEntity<String> addContact(ServletRequest request, String req) throws JSONException;

    ResponseEntity<?> getContacts(ServletRequest request) throws JSONException;

    ResponseEntity<?> deleteContacts(ServletRequest request, String req) throws JSONException;
}
