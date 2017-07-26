package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.dao.IBidResult;
import com.udoo.dal.entities.Token;
import com.udoo.dal.entities.User;
import com.udoo.dal.entities.UserResponse;
import com.udoo.dal.entities.Verification;
import com.udoo.dal.entities.history.UserHistory;
import com.udoo.dal.repositories.ITokenRepository;
import com.udoo.dal.repositories.IUserHistoryRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.dal.repositories.IVerificationRepository;
import com.udoo.restservice.IUserServiceController;
import com.udoo.restservice.email.EmailService;
import com.udoo.restservice.payment.IPaymentService;
import com.udoo.restservice.sms.SmsService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;


/**
 */
@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserServiceController implements IUserServiceController {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private ITokenRepository tokenRepository;

    @Resource
    private IVerificationRepository verificationRepository;

    @Resource
    private IUserHistoryRepository userHistoryRepository;

    @Autowired
    private EmailService emailService;


    @Autowired
    private SmsService smsService;

    @Autowired
    private IBidResult bidResult;


    @Override
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(ServletRequest request, @RequestBody final User user) {
        if (user != null) {
            if (user.getBirthdate() != null && (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null"))) {
                user.setBirthdate(null);
            }
            User cuser = userRepository.findByUid(Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString()));
            if (cuser == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            } else {
                User user2 = userRepository.getByEmail(user.getEmail());
                if (user2.getUid() == user.getUid()) {
                    return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
                } else {
                    if (user.getLocation() == null) {
                        user.setLocation("");
                        user.setLocation("");
                    }
                    String responseMessage = "Profile updated";
                    if (!user.getEmail().equals(user2.getEmail())) {
                        responseMessage = "Check your email address";
                        int activated = user2.getActive();
                        verificationRepository.deleteByUid(user.getUid(), false);
                        emailService.sendEmailVerification(user);
                        activated &= ~0b10;
                        user.setActive(activated);
                    }
                    if (!user.getPhone().equals(user2.getPhone())) {
                        if (responseMessage.equals("Check your email address")) {
                            responseMessage += " and phone";
                        } else {
                            responseMessage = "Check your phone";
                        }
                        int activated = user2.getActive();
                        verificationRepository.deleteByUid(user.getUid(), false);
                        smsService.sendVerificationMessage(user);
                        activated &= ~0b1000;
                        user.setActive(activated);
                    }
                    UserHistory userHistory = new UserHistory();
                    userHistory.setUid(user.getUid());
                    userHistory.setDate(new Date());

                    if(!user.getPicture().equals(cuser.getPicture())){
                        userHistory.setAction(2);
                    } else {
                        userHistory.setAction(1);
                    }
                    userHistoryRepository.save(userHistory);
                    userRepository.save(user);
                    return new ResponseEntity<>(responseMessage, HttpStatus.OK);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public ResponseEntity<?> logoutUser(ServletRequest request) {
        Token token = tokenRepository.getByToken(((HttpServletRequest) request).getHeader(AUTHORIZATION).substring(7));
        if (token != null) {
            token.setDisable(true);
            tokenRepository.save(token);
            return new ResponseEntity<>("Success", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Incorrect parameter", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public ResponseEntity<?> getUserData(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString()));
        if (user != null) {
            UserResponse resp = new UserResponse();
            resp.setUser(user);
            resp.setBids(bidResult.getBids((long) user.getUid()));
            resp.setReminders(bidResult.getUserReminders((long) user.getUid()));
            return new ResponseEntity<>(resp, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(ServletRequest request, @RequestBody String req) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString()));
            String currentpassword = mapper.convertValue(node.get("cpass"), String.class);
            String newpassword = mapper.convertValue(node.get("npass"), String.class);
            if (user != null && currentpassword != null && newpassword != null) {
                if (user.getPassword().equals(currentpassword)) {
                    user.setPassword(newpassword);
                    userRepository.save(user);
                    return new ResponseEntity<>("Password changed", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
                }
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Incorrect parameter", HttpStatus.NOT_MODIFIED);
    }
}