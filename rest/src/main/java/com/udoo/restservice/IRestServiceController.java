package com.udoo.restservice;


import com.udoo.dal.entities.Category;
import com.udoo.dal.entities.User;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(User user);

    ResponseEntity<?> loginUser(User data);

    ResponseEntity<?> getUser(int uid) throws IOException;

    void getImage(String name, HttpServletResponse response) throws IOException;

    ResponseEntity<?> upload(MultipartFile inputFile);

    ResponseEntity<?> multiFileUpload(MultipartFile[] files);

    ResponseEntity<List<Category>> getCategories();

    ResponseEntity<?> getAllService(int category, String searchText, int type) throws JSONException;

    ResponseEntity<?> getAllServiceWithoutText(int category, int type) throws JSONException;

    ResponseEntity<?> getResults(String searchText, int type) throws JSONException;
}
