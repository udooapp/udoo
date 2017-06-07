package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRequestServiceController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.io.IOException;
import java.util.List;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/request")
public class RequestServiceController implements IRequestServiceController {

    @Resource
    private IRequestRepository requestRepository;
    @Resource
    private IUserRepository userRepository;


    @Override
    @RequestMapping(value = "/user/saverequest", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(ServletRequest req, @RequestBody Request request) {
        if (request != null) {

            User user = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
            if (user != null) {
                request.setUid(user.getUid());
                requestRepository.save(request);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid user", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }

    }

    @Override
    @RequestMapping(value = "/user/deleterequest", method = RequestMethod.POST)
    public ResponseEntity<String> deleteUserRequest(ServletRequest req, @RequestBody String request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(request);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                if (requestRepository.findByRid(id).getUid() == Integer.parseInt(req.getAttribute(USERID).toString())) {
                    int succes = requestRepository.deleteByRid(id);
                    if (succes > -1) {
                        return new ResponseEntity<>("Request deleted", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
                }
            }
            return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("Invalid body", HttpStatus.BAD_REQUEST);
        }
    }


    @Override
    @RequestMapping(value = "/user/request", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<List<Request>> getAllUserRequest(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            return new ResponseEntity<>(requestRepository.findByUid(user.getUid()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Request> getRequest(@PathVariable("id") int uid) {

        return new ResponseEntity<>(requestRepository.findByRid(uid), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/requests/{category}/{searchText}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllRequests(@PathVariable("category") int category,
                                            @PathVariable("searchText") String searchText) {
        List<Request> requests;
        if (category > 0) {
            requests = requestRepository.findAllMatches(category, searchText);
        } else {
            requests = requestRepository.findAllByTitleContainingOrDescriptionContaining(searchText);
        }
        for (Request request : requests) {
            User usr = userRepository.findByUid(request.getUid());
            if (usr != null && usr.getPicture() != null) {
                request.setImage(usr.getPicture());
            } else {
                request.setImage("");
            }
        }
        return new ResponseEntity<Object>(requests, HttpStatus.OK);
    }


    @Override
    @RequestMapping(value = "/requests/{category}/", method = RequestMethod.GET)
    public ResponseEntity<?> getAllRequestsWithoutText(@PathVariable("category") int category) {
        List<Request> requests;
        if (category > 0) {
            requests = requestRepository.findAllActualByCategory(category);
        } else {
            requests = requestRepository.findAllActual();
        }
        for (Request request : requests) {
            User usr = userRepository.findByUid(request.getUid());
            if (usr != null && usr.getPicture() != null) {
                request.setImage(usr.getPicture());
            } else {
                request.setImage("");
            }
        }
        return new ResponseEntity<Object>(requests, HttpStatus.OK);
    }
}