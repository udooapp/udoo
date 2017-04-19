package com.udoo.restservice.spring;


import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;
import com.udoo.restservice.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;
import java.util.List;

/**
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class RestServiceController implements IRestServiceController {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;


   // @Autowired
   // private StorageService storageService;


    @Override
    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody final User user) {
        if (user != null) {
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                userRepository.save(user);
                return new ResponseEntity<>("Profile updated", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Override
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(@RequestBody final User user) {
        if (user != null) {
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                userRepository.save(user);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
                return new ResponseEntity<>("Succes", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Bad password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUserName(@PathVariable("id") final Integer id) {
        System.out.println(id + "id");
        if (id != null) {
            User user = userRepository.findByUid(id);
            if (user != null) {
                return user.toString();
            } else {
                return "Not Found";
            }
        } else {
            return "Error";
        }
    }

    @Override
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public User getUser(@PathVariable("id") final Integer id) {
        System.out.println(id + "id");
        if (id != null) {
            return userRepository.findByUid(id);
        } else {
            return null;
        }
    }


    @Override
    @RequestMapping(value = "/request/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<List<Request>> getAllUserRequest(@PathVariable("id") int uid) {

        return new ResponseEntity<>(requestRepository.findByUid(uid), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/offer/{id}", method = RequestMethod.GET)
    public ResponseEntity<List<Offer>> getAllUserOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByUid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(@RequestParam(value = "cpass") String currentpassword, @RequestParam(value = "npass") String newpassword, @RequestParam(value = "id") int id) {
        if (currentpassword != null && newpassword != null && id > 0) {
            User user = userRepository.findByUid(id);
            if (user.getPassword().equals(currentpassword)) {
                user.setPassword(newpassword);
                userRepository.save(user);
                return new ResponseEntity<>("Password changed", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("Password changed", HttpStatus.NOT_MODIFIED);
    }

    @Override
    @RequestMapping(value = "/saveoffer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(@RequestBody Offer offer) {
        if (offer != null) {
            offerRepository.save(offer);
            return new ResponseEntity<>("Saved", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Override
    @RequestMapping(value = "/saverequest", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(@RequestBody Request request) {
        if (request != null) {
            requestRepository.save(request);
            return new ResponseEntity<>("Saved", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Override
    @RequestMapping(value = "/offers", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOffers(){
        return new ResponseEntity<Object>(offerRepository.findAll(), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/requests", method = RequestMethod.GET)
    public ResponseEntity<?> getAllRequests(){
        return new ResponseEntity<Object>(requestRepository.findAll(), HttpStatus.OK);
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {

        final InternalResourceViewResolver result = new InternalResourceViewResolver();
        result.setViewClass(JstlView.class);
        result.setPrefix("/WEB-INF/jsp/");
        result.setSuffix(".jsp");

        return result;
    }

//    @RequestMapping(value = "/files/{picture:.+", method = RequestMethod.GET)
//    public ResponseEntity<org.springframework.core.io.Resource> getPicture(@PathVariable String filename){
//        org.springframework.core.io.Resource file = storageService.loadAsResouce(filename);
//        return new ResponseEntity<>(file, HttpStatus.OK);
//    }

//    @RequestMapping(value = "/upload", method = RequestMethod.POST)
//    public String savePicture(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes){
//        storageService.store(file);
//        redirectAttributes.addFlashAttribute("message",
//                "You successfully uploaded " + file.getOriginalFilename() + "!");
//
//        return "redirect:/login";
//    }

}