package com.udoo.restservice.security;

import com.udoo.dal.entities.Token;
import com.udoo.dal.repositories.ITokenRepository;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

import static com.udoo.restservice.spring.RestServiceController.USERID;

@WebFilter("/AuthenticationFilter")
public class AuthenticationFilter implements Filter {

    private static final String AUTHORIZATION = "authorization";

    private ServletContext context;

    private ITokenRepository tokenRepository;

    public void init(FilterConfig fConfig) throws ServletException {
        this.context = fConfig.getServletContext();
        this.context.log("AuthenticationFilter initialized");
        tokenRepository = WebApplicationContextUtils.getRequiredWebApplicationContext(this.context).getBean(ITokenRepository.class);
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        final String authHeader = req.getHeader(AUTHORIZATION);
        if ("OPTIONS".equals(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
        } else {
            Token token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = tokenRepository.getByToken(authHeader.substring(7));
            }
            if (token == null || token.getExpirydate().getTime() < new Date().getTime() || token.isDisable()) {
                if (token != null && token.getExpirydate().getTime() < new Date().getTime()) {
                    token.setDisable(true);
                    tokenRepository.save(token);
                }
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access request");
            } else {
                request.setAttribute(USERID, token.getUid());
                chain.doFilter(request, response);
            }
        }

    }


    public void destroy() {
        //close any resources here
    }
}
