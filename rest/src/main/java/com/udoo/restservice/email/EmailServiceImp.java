package com.udoo.restservice.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;


@Component
public class EmailServiceImp implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendEmailVerification(String to, String name, String link) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Email verification!");
            message.setText("Dear " + name + "\n Email verification: " + link);
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
    }

    @Override
    public void sendEmailPasswordReminder(String to, String name, String link) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password reminder!");
            message.setText("Dear " + name + "\nClick here: " + link);
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
    public void sendEmailNewMessage(String to,  String name, String from) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("You got a new message!");
            message.setText("Dear " + name + "\n" + from + " write something for you!");
            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
        }
    }
}
