package com.udoo.restservice.sms;

import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.Verification;
import com.udoo.dal.repositories.IVerificationRepository;
import com.udoo.dal.smsprovider.SmsProvider;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;
import java.util.Calendar;

/**
 */
@PropertySource("classpath:app.properties")
public class SmsServiceImp implements SmsService {
    @Autowired
    private SmsProvider smsProvider;

    @Autowired
    private Environment env;

    @Resource
    private IVerificationRepository verificationRepository;

    @Override
    public String sendVerificationMessage(User user) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, 1);
        String token = Jwts.builder().setSubject(env.getProperty("token.key")).signWith(SignatureAlgorithm.HS256,
                MacProvider.generateKey()).compact();
        Verification verification = new Verification(user.getUid(), token.substring(token.length() - 6)
                , cal.getTime(), false);
        if (verificationRepository.save(verification) != null) {
            return smsProvider.sendMessage(user.getPhone(), "Hi"+ user.getName() + ", \n User Phone verification token is: " + verification.getToken()) ? verification.getToken() : "";

        }
        return "";
    }

    @Override
    public boolean sendMessage(User user, String message) {
        return smsProvider.sendMessage(user.getPhone(), message);
    }
}
