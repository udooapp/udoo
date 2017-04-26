package com.udoo.restservice;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import org.springframework.http.ResponseEntity;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    ResponseEntity<?> logoutUser(User user);

    String getUserName(final Integer id);

    ResponseEntity<?> getAllUserRequest(int uid);

    ResponseEntity<?> getAllUserOffer(int uid);

    ResponseEntity<String> saveOffer(Offer offer);

    ResponseEntity<String> saveRequest(Request request);

    ResponseEntity<String> updatePassword(String currentpassword, String newpassword, int id);

    ResponseEntity<String> updateUser(final User user);

    User getUser(final Integer id);

    ResponseEntity<?> getAllOffers(int category, String searchText);

    ResponseEntity<?> getAllRequests(int category, String searchText);
}
