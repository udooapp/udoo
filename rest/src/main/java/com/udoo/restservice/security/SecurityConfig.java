package com.udoo.restservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.sql.DataSource;

@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery("select email, password from users where email=?");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
            .authorizeRequests().anyRequest().permitAll().and().csrf().disable();
//            .and()
//            .formLogin().loginPage("/login").failureUrl("/login?error")
//            .usernameParameter("username").passwordParameter("password")
//            .and()
//            .logout().logoutSuccessUrl("/logout")
//            .and()
//            .exceptionHandling().accessDeniedPage("/403")
//            .and()
//            .csrf();
    }
    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler mySuccessHandler() {
        return new SavedRequestAwareAuthenticationSuccessHandler();
    }

    @Bean
    public SimpleUrlAuthenticationFailureHandler myFailureHandler() {
        return new SimpleUrlAuthenticationFailureHandler();
    }
}
