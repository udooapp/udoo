package com.udoo.restservice.email;

import com.udoo.dal.entities.Reminder;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.Verification;
import com.udoo.dal.repositories.IReminderRepository;
import com.udoo.dal.repositories.IVerificationRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Calendar;


@Component
@PropertySource("classpath:app.properties")
public class EmailServiceImp implements EmailService {

    @Autowired
    private Environment env;


    @Autowired
    private JavaMailSender emailSender;

    @Resource
    private IReminderRepository reminderRepository;

    @Resource
    private IVerificationRepository verificationRepository;

    @Override
    public boolean sendEmailVerification(User user) {
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, 1);
            Verification verification =
                    new Verification(user.getUid(),
                            Jwts.builder().setSubject(user.getEmail()).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact(),
                            cal.getTime(), false);
            verificationRepository.deleteByUid(user.getUid(), false);
            verificationRepository.save(verification);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Email verification");
            message.setText("Dear " + user.getName() + "\n Please click on the link to the email verification: \n" + env.getProperty("udoo.url") + "verification/" + verification.getToken());
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public boolean sendEmailPasswordReminder(User user) {
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DATE, 1);
            Reminder reminder =
                    new Reminder(user.getUid(),
                            Jwts.builder().setSubject(user.getEmail()).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact(),
                            cal.getTime());
            reminderRepository.deleteByUid(user.getUid());
            reminderRepository.save(reminder);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Password reminder!");
            message.setText("Dear " + user.getName() + "\nClick here:\n" + env.getProperty("udoo.url") + reminder.getToken());
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public void sendEmailPasswordChangeMessage(String to, String name, String ipAddress) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your password changed!");
            message.setText("Dear " + name + "\nSomeone changed your password!\nIP address: " + ipAddress);
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
    }

    @Override
    public void sendEmailNewMessage(String to, String name, String from) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("New message!");
            message.setText("Dear " + name + "\nYou got a new message from " + from + "!");
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
    }
}
