package com.udoo.restservice.spring;

import com.udoo.restservice.IRestServiceController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 */
@Configuration
@ComponentScan
public class MainRestServiceConfiguration {

    @Bean
    public IRestServiceController restServiceController() {
        return new RestServiceController();
    }
}