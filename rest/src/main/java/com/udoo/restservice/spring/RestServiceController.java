package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.entities.*;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IRestServiceController;

import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 */
@RestController
@CrossOrigin
public class RestServiceController implements IRestServiceController {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private ICategoryRepository categoryRepository;

    @Resource
    private IContactRepository contactRepository;

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

    @RequestMapping(value = "/request/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Request> getRequest(@PathVariable("id") int uid) {

        return new ResponseEntity<>(requestRepository.findByRid(uid), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/request", method = RequestMethod.POST)
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

    @RequestMapping(value = "/deleterequest", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> deleteUserRequest(@RequestBody String request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(request);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                int succes = requestRepository.deleteByRid(id);
                if (succes > -1) {
                    return new ResponseEntity<>("Request deleted", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            System.out.println(e.toString());
            return new ResponseEntity<String>("Invalid body", HttpStatus.BAD_REQUEST);
        }
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

    @RequestMapping(value = "/addcontact", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> addContact(@RequestBody String req) throws JSONException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                User user = userRepository.findByUid(id);
                if (user.getUid() > -1) {
                    User currentUser = userRepository.findByEmail(mapper.convertValue(node.get("token").get("username"), String.class)).get(0);
                    if (currentUser != null && currentUser.getUid() > 0) {
                        if (!currentUser.getUid().equals(user.getUid())) {
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

    @RequestMapping(value = "/contacts", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> getContacts(@RequestBody String token) throws JSONException {
        JSONObject obj = new JSONObject(token);
        User currentUser = userRepository.findByEmail(obj.getString("username")).get(0);
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

    @RequestMapping(value = "/deleteContact", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> deleteContacts(@RequestBody String req) throws JSONException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                User user = userRepository.findByUid(id);
                if (user.getUid() > -1) {
                    User currentUser = userRepository.findByEmail(mapper.convertValue(node.get("token").get("username"), String.class)).get(0);
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

    @RequestMapping(value = "/deleteoffer", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<String> deleteUserOffer(@RequestBody String request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(request);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                int succes = offerRepository.deleteByOid(id);
                if (succes > -1) {
                    return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(@RequestBody String req) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            String email = mapper.convertValue(node.get("token").get("username"), String.class);
            String currentpassword = mapper.convertValue(node.get("cpass"), String.class);
            String newpassword = mapper.convertValue(node.get("npass"), String.class);
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
        }catch (IOException e){
            System.out.println( e.toString());
        }
        return new ResponseEntity<>("Incorrect parameter", HttpStatus.NOT_MODIFIED);
    }


    @RequestMapping(value = "/offer/{id}", method = RequestMethod.GET)
    public ResponseEntity<Offer> getOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByOid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/saveoffer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(@RequestBody String req) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            String email = mapper.convertValue(node.get("token").get("username"), String.class);
            Offer offer = mapper.convertValue(node.get("offer"), Offer.class);
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
        } catch (IOException e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Invalid request parameters", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @RequestMapping(value = "/saverequest", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(@RequestBody String req) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            String email = mapper.convertValue(node.get("token").get("username"), String.class);
            Request request = mapper.convertValue(node.get("request"), Request.class);
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
        } catch (IOException e) {
            System.out.println(e.toString());
            return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @RequestMapping(value = "/offers/{category}/{searchText}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllOffers(@PathVariable("category") int category,
                                          @PathVariable("searchText") String searchText) {
        List<Offer> offers;
        System.out.println("Category long:" + category);
        if (category >= 0) {
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
        System.out.println("Category short:" + category);
        if (category >= 0) {
            System.out.println("Selected category:" + category);
            offers = offerRepository.findAllActualByCategory(category);
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
        System.out.println("Category long:" + category);
        if (category > 0) {
            requests = requestRepository.findAllMatches(category, searchText);
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
        System.out.println("Category short:" + category);
        if (category > 0) {
            requests = requestRepository.findAllActualByCategory(category);
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
    public @ResponseBody
    void getImage(@PathVariable("image") String name, HttpServletResponse response) throws IOException {
        System.out.println(name);
        File file = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + name);
        InputStream in = new FileInputStream(file);
        response.setContentType("image/*");
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        response.setHeader("Content-Length", String.valueOf(file.length()));
        FileCopyUtils.copy(in, response.getOutputStream());
    }

    @RequestMapping(value = "/userinfo/{uid}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> getUser(@PathVariable("uid") int uid) throws IOException {
        if (uid > 0) {
            User user = userRepository.findByUid(uid);
            if (user != null && user.getUid() >= 0) {
                user.setPassword("");
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }
        return new ResponseEntity<String>("Not found", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile inputFile) {
        HttpHeaders headers = new HttpHeaders();
        SimpleDateFormat date = new SimpleDateFormat("yyyy_MM_dd_G_HH_mm_ss_S");
        if (!inputFile.isEmpty()) {
            try {
                //  String filename = date.format(new Date()) + "_" + inputFile.getOriginalFilename();
                // File destinationFile = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + filename);
                //  inputFile.transferTo(destinationFile);
                //  headers.add("File Uploaded Successfully - ", filename);
                StringBuilder sb = new StringBuilder();
                sb.append("data:image/png;base64,");
                sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(inputFile.getBytes(), false)));
                return new ResponseEntity<>(sb, HttpStatus.OK);
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
        SimpleDateFormat date = new SimpleDateFormat("yyyy_MM_dd_G_HH_mm_ss_S");
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; //next pls
            }
            try {
                byte[] bytes = file.getBytes();
                String fileName = date.format(new Date()) + "_" + file.getOriginalFilename();
                Path path = Paths.get(context.getRealPath("/WEB-INF/uploaded" + File.separator + fileName));
                Files.write(path, bytes);
                imageNames.add(fileName);
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