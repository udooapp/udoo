package com.udoo.restservice.spring;

import com.udoo.restservice.IRestServiceController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

/**
 */
@Configuration
@ComponentScan
public class MainRestServiceConfiguration {

    private static final long MAX_UPLOAD_SIZE = 50000000L; //50 MB

    @Bean
    public IRestServiceController restServiceController() {
        return new RestServiceController();
    }

    @Bean
    public CommonsMultipartResolver multipartResolver(){
        final CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        commonsMultipartResolver.setDefaultEncoding("utf-8");
        commonsMultipartResolver.setMaxUploadSize(MAX_UPLOAD_SIZE);
        return commonsMultipartResolver;
    }
}