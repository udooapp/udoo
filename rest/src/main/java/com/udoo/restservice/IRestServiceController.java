package com.udoo.restservice;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    ResponseEntity<?> logoutUser(User user);

    String getUserName(final Integer id);

    ResponseEntity<?> getAllUserRequest(String token);

    ResponseEntity<?> getAllUserOffer(String token);

    ResponseEntity<String> saveOffer(Offer offer, String email);

    ResponseEntity<String> saveRequest(Request request, String email);

    ResponseEntity<String> updatePassword(String currentpassword, String newpassword, String email);

    ResponseEntity<String> updateUser(final User user);

    User getUser(final String id);

    ResponseEntity<?> getAllOffers(int category, String searchText);


    void getImage(String name, HttpServletResponse response) throws IOException;

    ResponseEntity<?> upload(MultipartFile inputFile);

    ResponseEntity<?> multiFileUpload(MultipartFile[] files);
    ResponseEntity<?> getAllRequests(int category, String searchText);
}
