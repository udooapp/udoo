package com.udoo.dal.spring;

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
@PropertySource("classpath:email.properties")
public class EmailConfig {
    private final String SPRING_MAIL_PROTOCOL="mail.transport.protocol";
    private final String SPRING_MAIL_SMTP_AUTH="mail.smtp.auth";
    private final String SPRING_MAIL_SMTP_STARTTLS ="mail.smtp.starttls.enable";
    private final String SPRING_MAIL_DEBUG="mail.debug";

    @Autowired
    private Environment env;


    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(env.getProperty("spring.mail.host"));
        mailSender.setPort(Integer.parseInt("" + env.getProperty("spring.mail.port")));
        mailSender.setUsername(env.getProperty("spring.mail.username"));
        mailSender.setPassword(env.getProperty("spring.mail.password"));

        Properties props = mailSender.getJavaMailProperties();
        props.put(SPRING_MAIL_PROTOCOL, env.getProperty("spring.mail.protocol"));
        props.put(SPRING_MAIL_SMTP_AUTH, env.getProperty("spring.mail.smtp.auth"));
        props.put(SPRING_MAIL_SMTP_STARTTLS, env.getProperty("spring.mail.smtp.starttls.enable"));
        props.put(SPRING_MAIL_DEBUG, env.getProperty("spring.mail.smpt.debug"));

        return mailSender;
    }
}
