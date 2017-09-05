package com.udoo.restservice.spring;


import com.udoo.dal.dao.ICategoryResult;
import com.udoo.dal.entities.*;
import com.udoo.dal.entities.category.Category;
import com.udoo.dal.entities.history.History;
import com.udoo.dal.entities.history.HistoryElement;
import com.udoo.dal.entities.offer.OfferLite;
import com.udoo.dal.entities.offer.OfferMap;
import com.udoo.dal.entities.request.RequestLite;
import com.udoo.dal.entities.request.RequestMap;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.user.UserRegistration;
import com.udoo.dal.repositories.*;
import com.udoo.dal.repositories.history.IHistoryElementRepository;
import com.udoo.dal.repositories.history.IHistoryRepository;
import com.udoo.dal.repositories.offer.IOfferLiteRepository;
import com.udoo.dal.repositories.request.IRequestLiteRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRestServiceController;

import com.udoo.restservice.email.EmailService;
import com.udoo.restservice.sms.SmsService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    private IHistoryElementRepository historyElementRepository;

    @Resource
    private IRequestLiteRepository requestLiteRepository;


    @Resource
    private IHistoryRepository historyRepository;

    @Resource
    private IOfferLiteRepository offerLiteRepository;

    @Autowired
    private ICategoryResult categoryResultRepository;


    @Override
    @RequestMapping(value = "social/registration", method = RequestMethod.POST)
    public ResponseEntity<String> saveFacebookUser(UserRegistration userRegistration) {
        if (userRegistration != null) {
            if (userRegistration.getBirthdate().isEmpty() || userRegistration.getBirthdate().equals("null")) {
                userRegistration.setBirthdate(null);
            }
            if (userRepository.findByEmail(userRegistration.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                User user = new User(userRegistration);
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
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public ResponseEntity<String> saveUser(@RequestBody UserRegistration userRegistration) {
        if (userRegistration != null) {
            if (userRegistration.getBirthdate().isEmpty() || userRegistration.getBirthdate().equals("null")) {
                userRegistration.setBirthdate(null);
            }
            if (userRepository.findByEmail(userRegistration.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                User user = new User(userRegistration);
                user.setStars(0);
                user.setUid(-1);
                user.setPhone('+' + user.getPhone().replaceAll("[^\\d]", ""));
                user = userRepository.save(user);
                if (emailService.sendEmailVerification(user)) {
                    user.setActive(0b0001);
                    user = userRepository.save(user);
                    if (!smsService.sendVerificationMessage(user).isEmpty()) {
                        user.setActive(0b0101);
                        userRepository.save(user);
                        History usrHistory = new History();
                        usrHistory.setDate(new Date());
                        usrHistory.setTid(user.getUid());
                        usrHistory.setType(0);
                        usrHistory = historyRepository.save(usrHistory);
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setAction(WallServiceController.NEW);
                        historyElement.setHid(usrHistory.getHid());
                        historyElement.setAfterState("");
                        historyElementRepository.save(historyElement);
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
                    } else if (type && usr == null && usr2.getGoogleid() == null || usr2.getGoogleid().isEmpty()) {
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
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> loginUser(@RequestBody LoginData user) {
        User user2 = userRepository.getByEmail(user.getEmail());
        if (user2 != null) {
            if (user2.getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>(saveToken(user2.getUid()).getToken(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
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
                return new ResponseEntity<>(user.toUserLite(), HttpStatus.OK);
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
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ResponseEntity<?> getAllService(@RequestParam("category") int category, @RequestParam("search") String searchText) {
        SearchResult result = new SearchResult();
        boolean empty = searchText != null && !searchText.isEmpty();

        List<RequestLite> requests = empty ? (category > 0 ? requestLiteRepository.findAllMatches(category, searchText) : requestLiteRepository.findAllByTitleContainingOrDescriptionContaining(searchText)) : (category > 0 ?
                requestLiteRepository.findAllActualByCategory(category) : requestLiteRepository.findAllActual());
        result.setRequestLite(getRequestLiteList(requests));
        int sizeRequest = requests.size();
        result.setElementsRequest(changeRequestImage(requests.subList(0, sizeRequest > WallServiceController.PAGE_SIZE ? WallServiceController.PAGE_SIZE : sizeRequest)));
        List<OfferLite> offers = empty ? (category > 0 ? offerLiteRepository.findAllMatches(category, searchText) : offerLiteRepository.findAllByTitleContainingOrDescriptionContaining(searchText)) : (category > 0 ? offerLiteRepository.findAllActualByCategory(category) : offerLiteRepository.findAllActual());
        result.setOfferLite(getOfferLiteList(offers));
        int sizeOffer = offers.size();
        result.setElementsOffer(changeOfferImage(offers.subList(0, sizeOffer > WallServiceController.PAGE_SIZE ? WallServiceController.PAGE_SIZE : sizeOffer)));

        return new ResponseEntity<Object>(result, HttpStatus.OK);
    }


    @Override
    @RequestMapping(value = "/more", method = RequestMethod.GET)
    public ResponseEntity<?> getMoreService(@RequestParam("category") int category, @RequestParam("search") String searchText, @RequestParam("oCount") int oCount, @RequestParam("rCount") int rCount) {
        MoreService more = new MoreService();
        boolean empty = searchText == null || searchText.isEmpty();

        if (rCount >= 5) {
            Pageable page = new PageRequest(rCount / WallServiceController.PAGE_SIZE, WallServiceController.PAGE_SIZE);
            List<RequestLite> requests = empty ? (category > 0 ?
                    requestLiteRepository.findAllActualByCategory(category) : requestLiteRepository.findAllActual(page)) : (category > 0 ? requestLiteRepository.findAllMatches(category, searchText, page) : requestLiteRepository.findAllByTitleContainingOrDescriptionContaining(searchText, page));
            more.setRequests(changeRequestImage(requests));
        }

        if (oCount >= 5) {
            Pageable page = new PageRequest(oCount / WallServiceController.PAGE_SIZE, WallServiceController.PAGE_SIZE);
            List<OfferLite> offers = empty ? (category > 0 ? offerLiteRepository.findAllActualByCategory(category, page) : offerLiteRepository.findAllActual(page)) : (category > 0 ? offerLiteRepository.findAllMatches(category, searchText) : offerLiteRepository.findAllByTitleContainingOrDescriptionContaining(searchText, page));
            more.setOffers(changeOfferImage(offers));
        }

        return new ResponseEntity<>(more, HttpStatus.OK);
    }

    private List<RequestMap> getRequestLiteList(List<RequestLite> list) {
        List<RequestMap> requestLites = new ArrayList<>();
        for (RequestLite req : list) {
            requestLites.add(new RequestMap(req));
        }

        return requestLites;
    }

    private List<OfferMap> getOfferLiteList(List<OfferLite> list) {
        List<OfferMap> offerLites = new ArrayList<>();
        for (OfferLite off : list) {
            offerLites.add(new OfferMap(off));
        }

        return offerLites;
    }

    private List<ListElement> changeOfferImage(List<OfferLite> offers) {
        User usr;
        List<ListElement> list = new ArrayList<>();
        for (OfferLite offer : offers) {
            usr = userRepository.findByUid(offer.getUid());
            if (usr != null && usr.getPicture() != null) {
                ListElement element = new ListElement();
                element.setId(offer.getOid());
                element.setType(true);
                element.setTitle(offer.getTitle());
                element.setLocation(offer.getLocation());
                element.setPicture(usr.getPicture());
                element.setUser(usr.getName());
                list.add(element);
            }
        }
        return list;
    }

    private List<ListElement> changeRequestImage(List<RequestLite> requests) {
        User usr;
        List<ListElement> list = new ArrayList<>();
        for (RequestLite request : requests) {
            usr = userRepository.findByUid(request.getUid());
            if (usr != null && usr.getPicture() != null) {
                ListElement element = new ListElement();
                element.setId(request.getRid());
                element.setType(false);
                element.setTitle(request.getTitle());
                element.setLocation(request.getLocation());
                element.setPicture(usr.getPicture());
                element.setUser(usr.getName());
                list.add(element);
            }
        }
        return list;
    }

    @Override
    @RequestMapping(value = "/result", method = RequestMethod.GET)
    public ResponseEntity<?> getResults(@RequestParam("search") String searchText) {
        return new ResponseEntity<Object>(new com.udoo.dal.entities.search.SearchResult(categoryResultRepository.getWordMatch(searchText), categoryResultRepository.getAllCategories(searchText)), HttpStatus.OK);
    }
}