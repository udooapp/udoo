package com.udoo.restservice;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    ResponseEntity<?> logoutUser(ServletRequest request);

    String getUserName(final Integer id);

    ResponseEntity<String> updatePassword(ServletRequest request, String req);

    ResponseEntity<String> updateUser(ServletRequest request, final User user);

    User getUser(final String id);

    void getImage(String name, HttpServletResponse response) throws IOException;

    ResponseEntity<?> upload(MultipartFile inputFile);

    ResponseEntity<?> multiFileUpload(MultipartFile[] files);
}
