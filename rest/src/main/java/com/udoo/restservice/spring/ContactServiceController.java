package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.entities.Contact;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IContactRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IContactServiceController;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/contact")
public class ContactServiceController implements IContactServiceController {

    @Resource
    private IContactRepository contactRepository;
    @Resource
    private IUserRepository userRepository;

    @Override
    @RequestMapping(value = "/addcontact", method = RequestMethod.POST)
    public ResponseEntity<String> addContact(ServletRequest request, @RequestBody String req) throws JSONException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                User user = userRepository.findByUid(id);
                if (user.getUid() > -1) {
                    User currentUser = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
                    if (currentUser != null && currentUser.getUid() > 0) {
                        if (currentUser.getUid() == user.getUid()) {
                            contactRepository.save(new Contact(currentUser.getUid(), user.getUid()));
                            return new ResponseEntity<>("Success", HttpStatus.OK);
                        } else {
                            return new ResponseEntity<>("It's you are!", HttpStatus.OK);
                        }
                    }
                }
                return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/contacts", method = RequestMethod.GET)
    public ResponseEntity<?> getContacts(ServletRequest request) throws JSONException {
        User currentUser = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (currentUser != null && currentUser.getUid() > 0) {
            List<Contact> contact = contactRepository.findByUid(currentUser.getUid());
            List<User> users = new ArrayList<>();
            for (Contact cont : contact) {
                User usr = userRepository.findByUid(cont.getCid());
                if (usr != null) {
                    users.add(usr);
                }
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
        return new ResponseEntity<>("Something wrong", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/deleteContact", method = RequestMethod.POST)
    public ResponseEntity<?> deleteContacts(ServletRequest request, @RequestBody String req) throws JSONException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                User user = userRepository.findByUid(id);
                if (user.getUid() > -1) {
                    User currentUser = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
                    if (currentUser != null && currentUser.getUid() > 0) {
                        contactRepository.deleteByIds(currentUser.getUid(), user.getUid());
                        return new ResponseEntity<>("Contact removed", HttpStatus.OK);
                    }
                }
                return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }
}