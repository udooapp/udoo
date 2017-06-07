package com.udoo.restservice.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;


@Component
@PropertySource("classpath:app.properties")
public class EmailServiceImp implements EmailService {

    @Autowired
    private Environment env;


    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendEmailVerification(String to, String name, String urlToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Email verification");
            message.setText("Dear " + name + "\n Please click on the link to the email verification: \n" + env.getProperty("udoo.url") + "verification/" + urlToken);
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
    }

    @Override
    public void sendEmailPasswordReminder(String to, String name, String urlToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password reminder!");
            message.setText("Dear " + name + "\nClick here:\n" + env.getProperty("udoo.url") + urlToken);
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
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
