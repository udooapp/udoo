package com.udoo.dal.smsprovider;

public interface SmsProvider {

    boolean sendMessage(String to, String message);
}
