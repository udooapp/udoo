package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.dao.IBidResult;
import com.udoo.dal.entities.Notification;
import com.udoo.dal.entities.Token;
import com.udoo.dal.entities.history.History;
import com.udoo.dal.entities.history.HistoryElement;
import com.udoo.dal.entities.message.UserConversation;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.UserResponse;
import com.udoo.dal.repositories.*;
import com.udoo.dal.repositories.history.IHistoryElementRepository;
import com.udoo.dal.repositories.history.IHistoryRepository;
import com.udoo.dal.repositories.message.IUserConversationRepository;
import com.udoo.restservice.IUserServiceController;
import com.udoo.restservice.email.EmailService;
import com.udoo.restservice.security.AuthenticationFilter;
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
import java.util.ArrayList;
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
    private IHistoryRepository historyRepository;

    @Resource
    private IHistoryElementRepository historyElementRepository;

    @Resource
    private INotificationRepository notificationRepository;

    @Resource
    private IUserConversationRepository userConversationRepository;

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
            User userSaved = userRepository.findByUid(Integer.parseInt(request.getAttribute(AuthenticationFilter.USERID).toString()));
            if (userSaved == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            } else {
                User userEmail = userRepository.getByEmail(userUpdated.getEmail());
                if (userEmail != null && userEmail.getUid() != userUpdated.getUid()) {
                    return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
                } else {
                    if (userUpdated.getLocation() == null) {
                        userUpdated.setLocation("");
                    }

                    String responseMessage = "Profile updated";
                    if (!userUpdated.getEmail().equals(userSaved.getEmail())) {
                        responseMessage = "Check your email address";
                        int activated = userSaved.getActive();
                        verificationRepository.deleteByUid(userUpdated.getUid(), false);
                        emailService.sendEmailVerification(userUpdated);
                        activated &= ~0b10;
                        userUpdated.setActive(activated);
                    }
                    if (!userUpdated.getPhone().equals(userSaved.getPhone())) {
                        if (responseMessage.equals("Check your email address")) {
                            responseMessage += " and phone";
                        } else {
                            responseMessage = "Check your phone";
                        }
                        int activated = userSaved.getActive();
                        verificationRepository.deleteByUid(userUpdated.getUid(), false);
                        smsService.sendVerificationMessage(userUpdated);
                        activated = (activated |(1 << 2));
                        activated = (activated & ~(1 << 3));
                        userUpdated.setActive(activated);
                    }

                    History history = new History();
                    history.setTid(userUpdated.getUid());
                    history.setDate(new Date());
                    history.setType(0);
                    history = historyRepository.save(history);
                    boolean update = false;
                    if (userUpdated.getPicture() != null && !userUpdated.getPicture().equals(userSaved.getPicture())) {
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setBeforeState(userUpdated.getPicture());
                        historyElement.setAction(WallServiceController.UPDATED_PICTURE);
                        historyElement.setHid(history.getHid());
                        historyElement.setAfterState("");
                        historyElementRepository.save(historyElement);
                        update = true;
                    }
                    if (!userUpdated.getName().equals(userSaved.getName())) {
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setBeforeState(userUpdated.getName());
                        historyElement.setAction(WallServiceController.UPDATED_TITLE_OR_NAME);
                        historyElement.setHid(history.getHid());
                        historyElement.setAfterState("");
                        historyElementRepository.save(historyElement);
                        update = true;
                    }
                    if (!userUpdated.getPhone().equals(userSaved.getPhone())) {
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setBeforeState(userUpdated.getPhone());
                        historyElement.setAction(WallServiceController.UPDATED_PHONE_NUMBER);
                        historyElement.setHid(history.getHid());
                        historyElement.setAfterState("");
                        historyElementRepository.save(historyElement);
                        update = true;
                    }
                    if (!userUpdated.getEmail().equals(userSaved.getEmail())) {
                        HistoryElement historyElement = new HistoryElement();
                        historyElement.setBeforeState(userUpdated.getEmail());
                        historyElement.setAction(WallServiceController.UPDATED_EMAIL_ADDRESS);
                        historyElement.setHid(history.getHid());
                        historyElement.setAfterState("");
                        historyElementRepository.save(historyElement);
                        update = true;
                    }
                    if (!update) {
                        historyRepository.deleteByHid(history.getHid());
                    }
                    userUpdated.setPassword(userSaved.getPassword());
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
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(AuthenticationFilter.USERID).toString()));
        if (user != null) {
            UserResponse resp = new UserResponse();
            user.setFacebookid(0);
            user.setGoogleid("");
            user.setPassword("");
            resp.setUser(user);
            resp.setNotifications(notificationRepository.findAllByUidAndChecked(user.getUid(), false));
            List<UserConversation> userConversationList = userConversationRepository.findAllByFromIdAndChecked(user.getUid(), true);
            for (UserConversation userConversation : userConversationList) {
                Notification notification = new Notification();
                notification.setType(3);
                resp.getNotifications().add(notification);
            }
            for (Notification notification : resp.getNotifications()) {
                if (!notification.isChecked()) {
                    notification.setChecked(true);
                    notificationRepository.save(notification);
                    notification.setChecked(false);
                }
            }
            if (user.getActive() < 15) {
                List<String> systemNotification = new ArrayList<>();
                if (((user.getActive() >> 1) & 1) == 0) {
                    systemNotification.add("Please, activate your email address");
                }
                if (((user.getActive() >> 3) & 1) == 0) {
                    systemNotification.add("Please, activate your phone number");
                }
                resp.setSystemNotification(systemNotification);
            }
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
            User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(AuthenticationFilter.USERID).toString()));
            String currentpassword = mapper.convertValue(node.get("cpass"), String.class);
            String newpassword = mapper.convertValue(node.get("npass"), String.class);
            if (user != null && currentpassword != null && newpassword != null) {
                if (user.getPassword().equals(currentpassword) && newpassword.length() > 0) {
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