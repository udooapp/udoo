package com.udoo.restservice.sms;

import com.udoo.dal.entities.user.User;

/**
 *
 */
public interface SmsService {

    String sendVerificationMessage(User user);

    boolean sendMessage(User user, String message);

}
