package com.udoo.restservice.spring;

import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;

/**
 */
@RestController
public class RestServiceController implements IRestServiceController {


    @Resource
    private IUserRepository userRepository;

    @Override
    @RequestMapping(value = "/user/{name}", method = RequestMethod.POST)
    public ResponseEntity<String> saveUser(@PathVariable("name") final String name) {

        final User user = new User();
        user.setName(name);

        userRepository.save(user);

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