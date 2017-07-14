package com.udoo.restservice;

import com.udoo.dal.entities.Bid;
import com.udoo.dal.entities.CategoryResult;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IPidServiceController {

    ResponseEntity<?> savePid(ServletRequest req, Bid bid);

    ResponseEntity<?>  saveResponsePid(ServletRequest req, CategoryResult bid);
}
