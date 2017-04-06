package com.udoo.restservice.spring;

import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;

/**
 */
@RestController
public class RestServiceController implements IRestServiceController {


    @Resource
    private IUserRepository userRepository;


    @RequestMapping(value = "/user", method = RequestMethod.OPTIONS, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> checkPermission() {
        System.out.println("Option Check");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        System.out.println(user + "");
        if (user != null) {
            if (userRepository.findByName(user.getName()).size() > 0) {
                return new ResponseEntity<>("The username is exist!", HttpStatus.OK);
            } else if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.OK);
            } else {
                userRepository.save(user);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUserName(final Integer id) {
        return "test";
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