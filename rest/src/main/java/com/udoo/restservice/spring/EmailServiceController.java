package com.udoo.restservice.spring;


import com.udoo.dal.entities.Reminder;
import com.udoo.dal.entities.User;
import com.udoo.dal.entities.Verification;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IEmailServiceController;
import com.udoo.restservice.email.EmailServiceImp;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/mail")
public class EmailServiceController implements IEmailServiceController {

    @Autowired
    private EmailServiceImp emailServiceImp;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IVerificationRepository verificationRepository;
    @Resource
    private IReminderRepository reminderRepository;

    @Override
    @RequestMapping("/test")
    public ResponseEntity<String> sendTestMail() {
        emailServiceImp.sendEmailNewMessage("jozsatibold@yahoo.com", "Jozsa Tibold", "Udoo");
        return new ResponseEntity<>("Email sent!", HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/reminder/valid", method = RequestMethod.POST)
    public ResponseEntity<String> checkReminder(@RequestBody String token) {
        if (token != null && token.startsWith("{\"token\":\"")) {
            Reminder reminder = reminderRepository.getByToken(token.substring(10, token.length() - 2));
            if (reminder != null) {
                if (0 > new Date().compareTo(reminder.getExpiryDate())) {
                    return new ResponseEntity<>("Valid!", HttpStatus.OK);
                } else {
                    reminderRepository.deleteByRid(reminder.getRid());
                    return new ResponseEntity<>("Token expired!", HttpStatus.BAD_REQUEST);
                }
            }
            return new ResponseEntity<>("Invalid token", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);

    }
    @Override
    @RequestMapping(value = "/reminder", method = RequestMethod.POST)
    public ResponseEntity<String> sendPasswordReminder(@RequestBody String email) {
        if (email != null && email.startsWith("{\"email\":\"")) {
            User user = userRepository.getByEmail(email.substring(10, email.length() - 2));
            if (user != null) {
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.DATE, 1);
                Reminder reminder =
                        new Reminder(user.getUid(),
                                Jwts.builder().setSubject(user.getEmail()).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact(),
                                cal.getTime());
                reminderRepository.deleteByUid(user.getUid());
                reminderRepository.save(reminder);
                emailServiceImp.sendEmailPasswordReminder(user.getEmail(), user.getName(), reminder.getToken());
                return new ResponseEntity<>("Email sent!", HttpStatus.OK);
            }
            return new ResponseEntity<>("Invalid email address", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);

    }

    @Override
    @RequestMapping(value = "/verification", method = RequestMethod.POST)
    public ResponseEntity<String> sendEmailVerification(@RequestBody String email) {
        if (email != null && email.startsWith("{\"email\":\"")) {
            User user = userRepository.getByEmail(email.substring(10, email.length() - 2));
            if (user != null) {
                if (verificationRepository.getByUid(user.getUid()) != null) {
                    Calendar cal = Calendar.getInstance();
                    cal.add(Calendar.DATE, 1);
                    Verification verification =
                            new Verification(user.getUid(),
                                    Jwts.builder().setSubject(user.getEmail()).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact(),
                                    cal.getTime());
                    verificationRepository.deleteByUid(user.getUid());
                    verificationRepository.save(verification);
                    emailServiceImp.sendEmailVerification(user.getEmail(), user.getName(), verification.getToken());
                    return new ResponseEntity<>("Email sent!\nCheck your email address!", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("Your email address is active!", HttpStatus.OK);
                }
            }
            return new ResponseEntity<>("Invalid email address", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);

    }

    @Override
    @RequestMapping(value = "/verification/valid", method = RequestMethod.POST)
    public ResponseEntity<String> checkVerification(@RequestBody String token) {
        if (token != null && token.startsWith("{\"token\":\"")) {
            Verification verification = verificationRepository.getByToken(token.substring(10, token.length() - 2));
            if (verification != null) {
                verificationRepository.deleteByToken(verification.getToken());
                if (0 > new Date().compareTo(verification.getExpiryDate())) {
                    return new ResponseEntity<>("Your account is active!", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Token expired!", HttpStatus.BAD_REQUEST);
                }

            }
            return new ResponseEntity<>("Invalid token", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);

    }

    @Override
    @RequestMapping(value = "/reminder/password", method = RequestMethod.POST)
    public ResponseEntity<String> changePassword(@RequestBody String data) {
        if (data != null) {
            try {
                JSONObject object = new JSONObject(data);
                Reminder reminder = reminderRepository.getByToken(object.getString("token"));
                System.out.println("Token: " + reminder.getToken());
                String password = object.getString("password");
                if (reminder != null && password != null) {
                    if (0 > new Date().compareTo(reminder.getExpiryDate())) {
                        reminderRepository.deleteByRid(reminder.getRid());
                        User user = userRepository.findByUid(reminder.getUid());
                        user.setPassword(password);
                        userRepository.save(user);
                        return new ResponseEntity<>("Password changed!", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("Token expired", HttpStatus.UNAUTHORIZED);
                    }
                }
            } catch (JSONException e) {
                System.out.println("Parse exception: " + e.toString());
            }
            return new ResponseEntity<>("Invalid data", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);

    }

    @Override
    public ResponseEntity<String> sendMessage() {
        return null;
    }
}