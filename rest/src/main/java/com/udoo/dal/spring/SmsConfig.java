package com.udoo.dal.spring;

import com.udoo.dal.smsprovider.SmsProvider;
import com.udoo.dal.smsprovider.SmsProviderImpl;
import com.udoo.restservice.sms.SmsService;
import com.udoo.restservice.sms.SmsServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 *
 */
@Configuration
public class SmsConfig {

    @Bean
    public SmsProvider smsProvider() {
        return new SmsProviderImpl();
    }
    @Bean
    public SmsService smsService(){
        return new SmsServiceImp();
    }
}
