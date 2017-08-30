package com.udoo.restservice;


import com.udoo.dal.entities.category.Category;
import com.udoo.dal.entities.LoginData;
import com.udoo.dal.entities.Social;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.user.UserRegistration;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 */
public interface IRestServiceController {

    ResponseEntity<String> saveUser(UserRegistration user);

    ResponseEntity<String> saveFacebookUser(UserRegistration user);

    ResponseEntity<?> loginUser(LoginData data);

    ResponseEntity<?> loginFacebook(Social facebook);

    ResponseEntity<?> getUser(int uid) throws IOException;

    void getImage(String name, HttpServletResponse response) throws IOException;

    ResponseEntity<?> upload(MultipartFile inputFile);

    ResponseEntity<?> multiFileUpload(MultipartFile[] files);

    ResponseEntity<List<Category>> getCategories();

    ResponseEntity<?> getAllService(int category, String searchText);

    ResponseEntity<?> getMoreService(int category, String searchText, int oCount, int rCount);

    ResponseEntity<?> getResults(String searchText) throws JSONException;
}
