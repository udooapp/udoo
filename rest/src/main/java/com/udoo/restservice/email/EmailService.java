package com.udoo.restservice.email;

import com.udoo.dal.entities.user.User;

/**
 *
 */
public interface EmailService {

    boolean sendEmailVerification(User user);

    boolean sendEmailPasswordReminder(User user);

    void sendEmailPasswordChangeMessage(String to, String name, String ipAddress);

    void sendEmailNewMessage(String to, String name, String from);
}
