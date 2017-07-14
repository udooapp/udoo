package com.udoo.restservice;


import com.udoo.dal.entities.DeleteService;
import com.udoo.dal.entities.request.PicturesRequest;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.entities.request.RequestSave;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.List;

public interface IRequestServiceController {

    ResponseEntity<String> saveRequest(ServletRequest req, RequestSave save);

    ResponseEntity<String> deleteUserRequest(ServletRequest req, DeleteService service);

    ResponseEntity<List<Request>> getAllUserRequest(ServletRequest request, int cound, int last);

    ResponseEntity<?> getRequest(int id);

    ResponseEntity<?> getUserRequest(int id);

    ResponseEntity<?> getRequestData(int id);

    ResponseEntity<?> createRequest(ServletRequest req, String src);

    ResponseEntity<?> uploadImage(ServletRequest req, PicturesRequest image);


}
