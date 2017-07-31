package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.dao.IBidResult;
import com.udoo.dal.entities.Token;
import com.udoo.dal.entities.history.History;
import com.udoo.dal.entities.history.HistoryElement;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.UserResponse;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IUserServiceController;
import com.udoo.restservice.email.EmailService;
import com.udoo.restservice.sms.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

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
    private IHistoryRepository historyRepository;

    @Resource
    private IHistoryElementRepository historyElementRepository;

    @Autowired
    private EmailService emailService;


    @Autowired
    private SmsService smsService;

    @Autowired
    private IBidResult bidResult;


    @Override
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(ServletRequest request, @RequestBody final User userUpdated) {
        if (userUpdated != null) {
            if (userUpdated.getBirthdate() != null && (userUpdated.getBirthdate().isEmpty() || userUpdated.getBirthdate().equals("null"))) {
                userUpdated.setBirthdate(null);
            }
            User userSaved = userRepository.findByUid(Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString()));
            if (userSaved == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            } else {
                User user2 = userRepository.getByEmail(userUpdated.getEmail());
                if (user2 != null && user2.getUid() != userUpdated.getUid()) {
                    return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
                } else {
                    if (userUpdated.getLocation() == null) {
                        userUpdated.setLocation("");
                    }
                    user2 = userRepository.findByUid(userUpdated.getUid());
                    String responseMessage = "Profile updated";
                    if (!userUpdated.getEmail().equals(user2.getEmail())) {
                        responseMessage = "Check your email address";
                        int activated = user2.getActive();
                        verificationRepository.deleteByUid(userUpdated.getUid(), false);
                        emailService.sendEmailVerification(userUpdated);
                        activated &= ~0b10;
                        userUpdated.setActive(activated);
                    }
                    if (!userUpdated.getPhone().equals(user2.getPhone())) {
                        if (responseMessage.equals("Check your email address")) {
                            responseMessage += " and phone";
                        } else {
                            responseMessage = "Check your phone";
                        }
                        int activated = user2.getActive();
                        verificationRepository.deleteByUid(userUpdated.getUid(), false);
                        smsService.sendVerificationMessage(userUpdated);
                        activated &= ~0b1000;
                        userUpdated.setActive(activated);
                    }

                    History history = new History();
                    history.setTid(userUpdated.getUid());
                    history.setDate(new Date());
                    history.setType(0);
                    history = historyRepository.save(history);

                    if(userUpdated.getPicture() != null && !userUpdated.getPicture().equals(userSaved.getPicture())){
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setChanges(userSaved.getPicture());
                        historyElement.setAction(WallServiceController.UPDATED_PICTURE);
                        historyElement.setHid(history.getHid());
                        historyElementRepository.save(historyElement);
                    }
                    if(!userUpdated.getName().equals(userSaved.getName())){
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setChanges(userSaved.getName());
                        historyElement.setAction(WallServiceController.UPDATED_TITLE_OR_NAME);
                        historyElement.setHid(history.getHid());
                        historyElementRepository.save(historyElement);
                    }
                    if(!userUpdated.getPhone().equals(userSaved.getPhone())){
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setChanges(userSaved.getPhone());
                        historyElement.setAction(WallServiceController.UPDATED_PHONE_NUMBER);
                        historyElement.setHid(history.getHid());
                        historyElementRepository.save(historyElement);
                    }
                    if(!userUpdated.getEmail().equals(userSaved.getEmail())){
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setChanges(userSaved.getEmail());
                        historyElement.setAction(WallServiceController.UPDATED_EMAIL_ADDRESS);
                        historyElement.setHid(history.getHid());
                        historyElementRepository.save(historyElement);
                    }

                    userRepository.save(userUpdated);
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