package com.udoo.restservice.spring;


import com.udoo.dal.entities.Category;
import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.Request;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.ICategoryRepository;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
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
    @Resource
    private ICategoryRepository categoryRepository;


    @Override
    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody final User user) {
        if (user != null) {
            if (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null")) {
                user.setBirthdate(null);
            }
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                userRepository.save(user);
                return new ResponseEntity<>("Registration complete", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Override
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(@RequestBody final User user) {
        if (user != null) {
            if (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null")) {
                user.setBirthdate(null);
            }
            User cuser = userRepository.findByUid(user.getUid());
            if (cuser == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            } else {
                List<User> users = userRepository.findByEmail(user.getEmail());
                if (users.size() > 0 && !users.get(0).getUid().equals(user.getUid())) {
                    return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
                } else {
                    userRepository.save(user);
                    return new ResponseEntity<>("Profile updated", HttpStatus.OK);
                }
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
        List<User> users = userRepository.findByEmail(user.getEmail());
        if (users.size() > 0) {
            if (users.get(0).getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>("{\"token\": \"012dsa2sa2d2sa\"}", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUserName(@PathVariable("id") final Integer id) {
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
    @RequestMapping(value = "/user/{email:.+}", method = RequestMethod.GET)
    public User getUser(@PathVariable("email") final String email) {
        if (email != null) {
            return userRepository.findByEmail(email).get(0);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "/userdata", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUserData(@RequestBody String token) {
        try {
            List<User> users = userRepository.findByEmail(new JSONObject(token).getString("username"));
            if (users.size() > 0) {
                return new ResponseEntity<>(users.get(0), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (JSONException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }


    @Override
    @RequestMapping(value = "/request/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<List<Request>> getAllUserRequest(@RequestBody String token) {
        try {
            List<User> users = userRepository.findByEmail(new JSONObject(token).getString("username"));
            if (users.size() > 0) {
                System.out.println(users.get(0).getUid());
                return new ResponseEntity<>(requestRepository.findByUid(users.get(0).getUid()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (JSONException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value = "/deleterequest/{id}", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> deleteUserRequest(@PathVariable("id") int id, @RequestBody String token) {
        if(id > 0){
            int succes = requestRepository.deleteByRid(id);
            if(succes > -1) {
                return new ResponseEntity<>("Request deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(value = "/request/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Request> getRequest(@PathVariable("id") int uid) {

        return new ResponseEntity<>(requestRepository.findByRid(uid), HttpStatus.OK);
    }
    @Override
    @RequestMapping(value = "/offer", method = RequestMethod.POST)
    public ResponseEntity<List<Offer>> getAllUserOffer(@RequestBody String token) {
        try {
            List<User> users = userRepository.findByEmail(new JSONObject(token).getString("username"));
            if (users.size() > 0) {
                return new ResponseEntity<>(offerRepository.findByUid(users.get(0).getUid()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (JSONException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
    @RequestMapping(value = "/deleteoffer/{id}", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> deleteUserOffer(@PathVariable("id") int id, @RequestBody String token) {
        if(id > 0){
            int succes = offerRepository.deleteByOid(id);
            if(succes > -1) {
                return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }
    @Override
    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(@RequestParam(value = "cpass") String currentpassword, @RequestParam(value = "npass") String newpassword, @RequestParam(value = "email") String email) {
        if (currentpassword != null && newpassword != null && email != null && !email.isEmpty()) {
            List<User> user = userRepository.findByEmail(email);

            if (user.get(0).getPassword().equals(currentpassword)) {
                user.get(0).setPassword(newpassword);
                userRepository.save(user.get(0));
                return new ResponseEntity<>("Password changed", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("Incorrect email", HttpStatus.NOT_MODIFIED);
    }


    @RequestMapping(value = "/offer/{id}", method = RequestMethod.GET)
    public ResponseEntity<Offer> getOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByOid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/saveoffer/{email:.+}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(@RequestBody Offer offer, @PathVariable("email") String email) {
        if (offer != null && email != null) {
            List<User> users = userRepository.findByEmail(email);
            if (users.size() > 0) {
                offer.setUid(users.get(0).getUid());
                offerRepository.save(offer);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.NO_CONTENT);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Override
    @RequestMapping(value = "/saverequest/{email:.+}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(@RequestBody Request request, @PathVariable("email") String email) {
        if (request != null && email != null) {
            List<User> users = userRepository.findByEmail(email);
            if (users.size() > 0) {
                request.setUid(users.get(0).getUid());
                requestRepository.save(request);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.NO_CONTENT);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.NO_CONTENT);
        }
    }

    @Override
    @RequestMapping(value = "/offers/{category}/{searchText}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOffers(@PathVariable("category") int category, @PathVariable("searchText") String searchText) {
        List<Offer> offers;
        if (category > 0) {
            offers = offerRepository.findAllMatches(category, searchText);
        } else {
            offers = offerRepository.findAllByTitleContainingOrDescriptionContaining(searchText);
        }
        for (Offer offer : offers) {
            User usr = userRepository.findByUid(offer.getUid());
            offer.setImage(usr.getPicture());
        }
        return new ResponseEntity<Object>(offers, HttpStatus.OK);
    }

    @RequestMapping(value = "/offers/{category}/", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOffersWithoutText(@PathVariable("category") int category) {
        List<Offer> offers;
        if (category > 0) {
            offers = offerRepository.findAllByCategory(category);
        } else {
            offers = offerRepository.findAllActual();
        }
        for (Offer offer : offers) {
            User usr = userRepository.findByUid(offer.getUid());
            offer.setImage(usr.getPicture());
        }
        return new ResponseEntity<Object>(offers, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/requests/{category}/{searchText}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllRequests(@PathVariable("category") int category,
                                            @PathVariable("searchText") String searchText) {
        List<Request> requests;
        if (category > 0) {
            requests =requestRepository.findAllMatches(category, searchText);
        } else {
            requests = requestRepository.findAllByTitleContainingOrDescriptionContaining(searchText);
        }
        for (Request request : requests) {
            User usr = userRepository.findByUid(request.getUid());
            request.setImage(usr.getPicture());
        }
        return new ResponseEntity<Object>(requests, HttpStatus.OK);
    }

    @RequestMapping(value = "/requests/{category}/", method = RequestMethod.GET)
    public ResponseEntity<?> getAllRequestsWithoutText(@PathVariable("category") int category) {
        List<Request> requests;
        if (category > 0) {
            requests = requestRepository.findAllByCategory(category);
        } else {
            requests = requestRepository.findAllActual();
        }
        for (Request request : requests) {
            User usr = userRepository.findByUid(request.getUid());
            request.setImage(usr.getPicture());
        }
        return new ResponseEntity<Object>(requests, HttpStatus.OK);
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {
        final InternalResourceViewResolver result = new InternalResourceViewResolver();
        result.setViewClass(JstlView.class);
        result.setPrefix("/WEB-INF/jsp/");
        result.setSuffix(".jsp");

        return result;
    }

    @Autowired
    private ServletContext context;

    @RequestMapping(value = "/image/{image:.+}", method = RequestMethod.GET)
    public @ResponseBody void getImage(@PathVariable("image") String name, HttpServletResponse response) throws IOException {
        System.out.println(name);
        File file = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + name);
        InputStream in = new FileInputStream(file);
        response.setContentType("image/*");
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        response.setHeader("Content-Length", String.valueOf(file.length()));
        FileCopyUtils.copy(in, response.getOutputStream());
    }

    @Override
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile inputFile) {
        HttpHeaders headers = new HttpHeaders();
        if (!inputFile.isEmpty()) {
            try {
                String originalFilename = inputFile.getOriginalFilename();
                File destinationFile = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + originalFilename);
                inputFile.transferTo(destinationFile);
                headers.add("File Uploaded Successfully - ", originalFilename);
                return new ResponseEntity<>(originalFilename, headers, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @RequestMapping(value = "/uploadMulti", method = RequestMethod.POST)
    public ResponseEntity<?> multiFileUpload(@RequestParam("files") MultipartFile[] files) {
        List<String> imageNames = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; //next pls
            }
            try {
                byte[] bytes = file.getBytes();
                Path path = Paths.get(context.getRealPath("/WEB-INF/uploaded" + File.separator + file.getOriginalFilename()));
                Files.write(path, bytes);
                imageNames.add(file.getOriginalFilename());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (imageNames.isEmpty()) {
            return new ResponseEntity<>("Please select a file to upload", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(imageNames, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/categories", method = RequestMethod.GET)
    public ResponseEntity<List<Category>> getCategories() {
        return new ResponseEntity<>(categoryRepository.findAll(), HttpStatus.OK);
    }
}