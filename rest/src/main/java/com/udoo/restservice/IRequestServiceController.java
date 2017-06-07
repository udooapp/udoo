package com.udoo.restservice;


import com.udoo.dal.entities.Request;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.List;

public interface IRequestServiceController {

    ResponseEntity<String> saveRequest(ServletRequest req, Request request);

    ResponseEntity<String> deleteUserRequest(ServletRequest req, String request);

    ResponseEntity<List<Request>> getAllUserRequest(ServletRequest request);

    ResponseEntity<Request> getRequest(int uid);

    ResponseEntity<?> getAllRequests(int category, String searchText);

    ResponseEntity<?> getAllRequestsWithoutText(int category);
}
