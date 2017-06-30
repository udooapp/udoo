package com.udoo.restservice.spring;


import com.udoo.dal.dao.ICategoryResult;
import com.udoo.dal.entities.*;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.offer.PicturesOffer;
import com.udoo.dal.entities.request.PicturesRequest;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IRestServiceController;

import com.udoo.restservice.email.EmailService;
import com.udoo.restservice.sms.SmsService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
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
import java.util.*;


/**
 */
@RestController
@CrossOrigin
@PropertySource("classpath:app.properties")
public class RestServiceController implements IRestServiceController {

    public static final String USERID = "UID";

    @Autowired
    private ServletContext context;

    @Autowired
    private Environment env;


    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private ICategoryRepository categoryRepository;

    @Resource
    private ITokenRepository tokenRepository;


    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Autowired
    private ICategoryResult categoryResultRepository;

    @Override
    @RequestMapping(value = "social/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveFacebookUser(User user) {
        if (user != null) {
            if (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null")) {
                user.setBirthdate(null);
            }
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                if (user.getLocation() == null) {
                    user.setLocation("");
                }
                if (user.getLanguage() == null) {
                    user.setLanguage("en");
                }
                user.setUid(-1);
                user = userRepository.save(user);
                if (!smsService.sendVerificationMessage(user).isEmpty()) {
                    user.setActive(0b0111);
                    user = userRepository.save(user);
                    return new ResponseEntity<>(saveToken(user.getUid()).getToken(), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(saveToken(user.getUid()).getToken(), HttpStatus.OK);
                }

            }
        }
        return new ResponseEntity<>("Invalid data", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        if (user != null) {
            if (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null")) {
                user.setBirthdate(null);
            }
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                if (user.getLocation() == null) {
                    user.setLocation("");
                }
                if (user.getLanguage() == null) {
                    user.setLanguage("en");
                }
                user.setUid(-1);
                user = userRepository.save(user);
                if (emailService.sendEmailVerification(user)) {
                    user.setActive(0b0001);
                    user = userRepository.save(user);
                    if (!smsService.sendVerificationMessage(user).isEmpty()) {
                        user.setActive(0b0101);
                        userRepository.save(user);
                        return new ResponseEntity<>("Registration complete", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("Registration complete,  but please send a new sms verification!", HttpStatus.OK);
                    }
                } else {
                    return new ResponseEntity<>("Registration complete, but please send a new email verification !", HttpStatus.OK);
                }
            }
        }
        return new ResponseEntity<>("Invalid data", HttpStatus.BAD_REQUEST);
    }


    @Override
    @RequestMapping(value = "/social", method = RequestMethod.POST)
    public ResponseEntity<?> loginFacebook(@RequestBody Social social) {
        if (social != null) {
            boolean type = social.isType();
            User usr = type ? userRepository.getByGoogleid(social.getId()) : userRepository.getByFacebookid(Long.parseLong(social.getId()));
            User usr2 = userRepository.getByEmail(social.getEmail());
            if (usr == null && usr2 == null) {
                usr = new User();
                usr.setUid(-1);
                usr.setEmail(social.getEmail());
                usr.setName(social.getName());
                usr.setPicture(social.getPicture());
                usr.setBirthdate(social.getBirthday());
                if (type) {
                    usr.setGoogleid(social.getId());
                } else {
                    usr.setFacebookid(Long.parseLong(social.getId()));
                }
                return new ResponseEntity<>(usr, HttpStatus.OK);
            } else {

                if (usr2.getPicture() == null || usr2.getPicture().isEmpty()) {
                    usr2.setPicture(social.getPicture());
                    if (!type && usr == null && usr2.getFacebookid() == 0) {
                        usr2.setFacebookid(Long.parseLong(social.getId()));
                    } else if (type && usr == null && usr2.getGoogleid() == null  || usr2.getGoogleid().isEmpty()) {
                        usr2.setGoogleid(social.getId());
                    } else {
                        return new ResponseEntity<Object>("Unauthorized", HttpStatus.UNAUTHORIZED);
                    }
                    userRepository.save(usr2);
                }
            }
            return new ResponseEntity<>(saveToken(usr2.getUid()).getToken(), HttpStatus.OK);
        }
        return new ResponseEntity<Object>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User user2 = userRepository.getByEmail(user.getEmail());
        if (user2 != null) {
            if (user2.getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>(saveToken(user2.getUid()).getToken(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
    }

    private Token saveToken(int userID) {
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.DATE, Integer.parseInt(env.getProperty("token.expiry.date")));
        return tokenRepository.save(new Token(userID, generateToken(), c.getTime(), false));
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {
        final InternalResourceViewResolver result = new InternalResourceViewResolver();
        result.setViewClass(JstlView.class);
        result.setPrefix("/WEB-INF/jsp/");
        result.setSuffix(".jsp");
        return result;
    }

    @Override
    @RequestMapping(value = "/image/{image:.+}", method = RequestMethod.GET)
    public void getImage(@PathVariable("image") String name, HttpServletResponse response) throws IOException {
        File file = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + name);
        InputStream in = new FileInputStream(file);
        response.setContentType("image/*");
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        response.setHeader("Content-Length", String.valueOf(file.length()));
        FileCopyUtils.copy(in, response.getOutputStream());
    }

    @Override
    @RequestMapping(value = "/userinfo/{uid}", method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable("uid") int uid) throws IOException {
        if (uid > 0) {
            User user = userRepository.findByUid(uid);
            if (user != null && user.getUid() >= 0) {
                user.setPassword("");
                user.setActive(0);
                user.setBirthdate("");
                user.setLanguage("");
                user.setLocation("");
                user.setFacebookid(0);
                user.setGoogleid("");
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Not found", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/upload", method = RequestMethod.POST, headers = "content-type=multipart/*")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile inputFile) {
        if (!inputFile.isEmpty()) {
            try {
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
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; //next pls
            }
            try {
                StringBuilder sb = new StringBuilder();
                sb.append("data:image/png;base64,");
                sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(file.getBytes(), false)));
                imageNames.add(sb.toString());
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

    @Override
    @RequestMapping(value = "/categories", method = RequestMethod.GET)
    public ResponseEntity<List<Category>> getCategories() {
        return new ResponseEntity<>(categoryRepository.findAll(), HttpStatus.OK);
    }

    private String generateToken() {
        return Jwts.builder().setSubject(env.getProperty("token.key")).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact();
    }

    @Override
    @RequestMapping(value = "/search/{category}/{searchText}/{type}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllService(@PathVariable("category") int category, @PathVariable("searchText") String searchText, @PathVariable("type") int type) throws JSONException {
        SearchResult result = new SearchResult();
        if (type == 0 || type == 2) {
            List<Request> requests = category > 0 ? requestRepository.findAllMatches(category, searchText) : requestRepository.findAllByTitleContainingOrDescriptionContaining(searchText);
            result.setRequest(changeRequestImage(requests));
        }
        if (type == 0 || type == 1) {
            List<Offer> offers = category > 0 ? offerRepository.findAllMatches(category, searchText) : offerRepository.findAllByTitleContainingOrDescriptionContaining(searchText);
            result.setOffer(changeOfferImage(offers));
        }
        return new ResponseEntity<Object>(result, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/search/{category}/{type}", method = RequestMethod.GET)
    public ResponseEntity<?> getAllServiceWithoutText(@PathVariable("category") int category, @PathVariable("type") int type) throws JSONException {
        SearchResult result = new SearchResult();
        if (type == 0 || type == 2) {
            List<Request> requests = category > 0 ?
                    requestRepository.findAllActualByCategory(category) : requestRepository.findAllActual();
            result.setRequest(changeRequestImage(requests));
        }
        if (type == 0 || type == 1) {
            List<Offer> offers = category > 0 ? offerRepository.findAllActualByCategory(category) : offerRepository.findAllActual();
            result.setOffer(changeOfferImage(offers));
        }
        return new ResponseEntity<Object>(result, HttpStatus.OK);
    }

    private List<Offer> changeOfferImage(List<Offer> offers) {
        User usr;
        for (Offer offer : offers) {
            usr = userRepository.findByUid(offer.getUid());
            if (usr != null && usr.getPicture() != null) {
                List<PicturesOffer> off = new ArrayList<>();
                off.add(new PicturesOffer(usr.getPicture()));
                offer.setPicturesOffer(off);
            }
        }
        return offers;
    }

    private List<Request> changeRequestImage(List<Request> requests) {
        User usr;
        for (Request request : requests) {
            usr = userRepository.findByUid(request.getUid());
            if (usr != null && usr.getPicture() != null) {
                List<PicturesRequest> req = new ArrayList<>();
                req.add(new PicturesRequest(usr.getPicture()));
                request.setPicturesRequest(req);
            }
        }
        return requests;
    }

    @Override
    @RequestMapping(value = "/result/{searchText}/{type}", method = RequestMethod.GET)
    public ResponseEntity<?> getResults(@PathVariable("searchText") String searchText, @PathVariable("type") int type) throws JSONException {
        switch (type) {
            case 0:
                List<CategoryResult> listOffers = categoryResultRepository.getAllOffer(searchText);
                List<CategoryResult> listRequest = categoryResultRepository.getAllRequest(searchText);
                for (CategoryResult res : listOffers) {
                    for (int i = 0; i < listRequest.size(); ++i) {
                        if (res.getId() == listRequest.get(i).getId()) {
                            res.setResult(res.getResult() + listRequest.get(i).getResult());
                            listRequest.remove(i);
                            break;
                        }
                    }
                }
                return new ResponseEntity<Object>(listOffers, HttpStatus.OK);
            case 1:
                return new ResponseEntity<Object>(categoryResultRepository.getAllOffer(searchText), HttpStatus.OK);
            case 2:
                return new ResponseEntity<Object>(categoryResultRepository.getAllRequest(searchText), HttpStatus.OK);
        }
        List<CategoryResult> list = categoryResultRepository.getAllOffer(searchText);

        return new ResponseEntity<Object>(list, HttpStatus.OK);
    }
}