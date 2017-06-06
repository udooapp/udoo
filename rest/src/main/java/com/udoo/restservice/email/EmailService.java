package com.udoo.restservice.email;

/**
 *
 */
public interface EmailService {

    void sendEmailVerification(String to, String name, String link);

    void sendEmailPasswordReminder(String to, String name, String newPassword);

    void sendEmailPasswordChangeMessage(String to, String name, String ipAddress);

    void sendEmailNewMessage(String to, String name, String from);
}
