package com.udoo.dal.smsprovider;


public class SmsProviderImpl implements SmsProvider {
    @Override
    public boolean sendMessage(String to, String message) {

        System.out.println("Sms sent!\n To: " + to + "\n Message: " + message);
        return true;
    }
}
