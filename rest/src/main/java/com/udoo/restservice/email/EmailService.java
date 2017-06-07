package com.udoo.restservice.email;

/**
 *
 */
public interface EmailService {

    void sendEmailVerification(String to, String name, String urlToken);

    void sendEmailPasswordReminder(String to, String name, String urlTOken);

    void sendEmailPasswordChangeMessage(String to, String name, String ipAddress);

    void sendEmailNewMessage(String to, String name, String from);
}
