package com.udoo.restservice.spring;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 */
@RestController
public class RestServiceController implements IRestServiceController {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Override
    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody final User user) {
        if (user != null) {
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            }else {
                userRepository.save(user);
                return new ResponseEntity<>("Profile updated", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/registration", method = RequestMethod.OPTIONS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> checkPermission() {
        System.out.println("Option Check");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(@RequestBody final User user) {
        if (user != null) {
            if (userRepository.findByName(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The username is exist!", HttpStatus.UNAUTHORIZED);
            } else if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                userRepository.save(user);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/logout", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logoutUser(User user) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        System.out.println(user.toString());
        List<User> users = userRepository.findByEmail(user.getEmail());
        if (users.size() > 0) {
            if (users.get(0).getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Bad password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> checkPermissionLogin() {
        System.out.println("Option Check");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUserName(@PathVariable("id") final Integer id) {
        System.out.println(id + "id");
        if (id != null) {
            return userRepository.findByUid(id).toString();
        } else {
            return "Error";
        }
    }

    @Override
    @RequestMapping(value = "/requests/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getAllUserRequest(@PathVariable("id") int uid) {
        List<Request> requests = requestRepository.findByUid(uid);
        List<JSONObject> response = new ArrayList<JSONObject>();
        for (Request req : requests) {
            try {
                JSONObject entity = new JSONObject();
                entity.put("uid", req.getUid());
                entity.put("title", req.getTitle());
                entity.put("rid", req.getRid());
                entity.put("description", req.getDescription());
                entity.put("location", req.getLocation());
                entity.put("jobdate", req.getJobdate());
                entity.put("expirydate", req.getExpirydate());
                response.add(entity);
            } catch (JSONException e) {
                System.out.println(e.toString());
            }

        }
        return new ResponseEntity<Object>(response, HttpStatus.OK);
    }


    @Override
    @RequestMapping(value = "/offers/{id}", method = RequestMethod.GET)
    public ResponseEntity<List<Offer>> getAllUserOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByUid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(@RequestParam(value = "cpass") String currentpassword, @RequestParam(value = "npass") String newpassword, @RequestParam(value = "id") int id) {
        if (currentpassword != null && newpassword != null && id > 0) {
            User user = userRepository.findByUid(id);
            if(user.getPassword().equals(currentpassword)) {
                user.setPassword(newpassword);
                userRepository.save(user);
                return new ResponseEntity<String>("Password changed", HttpStatus.OK);
            } else {
                return new ResponseEntity<String>("Incorrect password", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<String>("Password changed", HttpStatus.NOT_MODIFIED);
    }

    @Override
    @RequestMapping(value = "/saveoffer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(@RequestBody Offer offer) {
        if (offer != null) {
            offerRepository.save(offer);
            return new ResponseEntity<>("Saved", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Override
    @RequestMapping(value = "/saverequest", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(@RequestBody Request request) {
        if (request != null) {
            requestRepository.save(request);
            return new ResponseEntity<>("Saved", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {

        final InternalResourceViewResolver result = new InternalResourceViewResolver();
        result.setViewClass(JstlView.class);
        result.setPrefix("/WEB-INF/jsp/");
        result.setSuffix(".jsp");

        return result;
    }
}