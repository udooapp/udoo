package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.entities.*;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IRestServiceController;

import com.udoo.restservice.email.EmailServiceImp;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;


/**
 */
@RestController
@CrossOrigin
@PropertySource("classpath:app.properties")
public class RestServiceController implements IRestServiceController {

    public static final String USERID = "UID";

    @Autowired
    private Environment env;

    @Autowired
    private EmailServiceImp emailServiceImp;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private ICategoryRepository categoryRepository;

    @Resource
    private ITokenRepository tokenRepository;

    @Resource
    private IVerificationRepository verificationRepository;

    @Override
    @RequestMapping(value = "/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveUser(@RequestBody final User user) {
        if (user != null) {
            if (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null")) {
                user.setBirthdate(null);
            }
            if (userRepository.findByEmail(user.getEmail()).size() > 0) {
                return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
            } else {
                User user2 = userRepository.save(user);
                String token = generateToken();
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.DATE, 1);
                verificationRepository.save(new Verification(user2.getUid(), token, cal.getTime()));
                emailServiceImp.sendEmailVerification(user.getEmail(), user.getName(), token);
                return new ResponseEntity<>("Registration complete", HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Invalid data", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/user/update", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateUser(ServletRequest request, @RequestBody final User user) {
        if (user != null) {
            if (user.getBirthdate() != null && (user.getBirthdate().isEmpty() || user.getBirthdate().equals("null"))) {
                user.setBirthdate(null);
            }
            User cuser = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
            if (cuser == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            } else {
                List<User> users = userRepository.findByEmail(user.getEmail());
                if (users.size() > 0 && !users.get(0).getUid().equals(user.getUid())) {
                    return new ResponseEntity<>("The email address is exist!", HttpStatus.UNAUTHORIZED);
                } else {
                    userRepository.save(user);
                    return new ResponseEntity<>("Profile updated", HttpStatus.OK);
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/user/logout", method = RequestMethod.GET)
    public ResponseEntity<?> logoutUser(ServletRequest request) {
        Token token = tokenRepository.getByToken(((HttpServletRequest) request).getHeader(AUTHORIZATION).substring(7));
        if (token != null) {
            token.setDisable(true);
            tokenRepository.save(token);
            return new ResponseEntity<>("Success", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Incorrect parameter", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User user2 = userRepository.getByEmail(user.getEmail());

        if (user2 != null) {
            if (user2.getPassword().equals(user.getPassword())) {
                List<Token> tokens = tokenRepository.findByUid(user2.getUid());
                Token token = null;
                for (Token tok : tokens) {
                    if (tok.isDisable()) {
                        token = tok;
                    }
                }
                Calendar c = Calendar.getInstance();
                c.setTime(new Date());
                c.add(Calendar.DATE, Integer.parseInt(env.getProperty("token.expiry.date")));
                if (token == null) {
                    token = tokenRepository.save(new Token(user2.getUid(), generateToken(), c.getTime(), false));
                } else {
                    token.setExpirydate(c.getTime());
                    token.setDisable(false);
                    token = tokenRepository.save(token);
                }
                return new ResponseEntity<>(token.getToken(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public String getUserName(@PathVariable("id") final Integer id) {
        if (id != null) {
            User user = userRepository.findByUid(id);
            if (user != null) {
                return user.toString();
            } else {
                return "Not Found";
            }
        } else {
            return "Error";
        }
    }

    @Override
    @RequestMapping(value = "/user/{email:.+}", method = RequestMethod.GET)
    public User getUser(@PathVariable("email") final String email) {
        if (email != null) {
            return userRepository.findByEmail(email).get(0);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "/user/userdata", method = RequestMethod.GET)
    public ResponseEntity<User> getUserData(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @RequestMapping(value = "/user/password", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePassword(ServletRequest request, @RequestBody String req) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(req);
            User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
            String currentpassword = mapper.convertValue(node.get("cpass"), String.class);
            String newpassword = mapper.convertValue(node.get("npass"), String.class);
            if (user != null && currentpassword != null && newpassword != null) {
                if (user.getPassword().equals(currentpassword)) {
                    user.setPassword(newpassword);
                    userRepository.save(user);
                    return new ResponseEntity<>("Password changed", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect password", HttpStatus.UNAUTHORIZED);
                }
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Incorrect parameter", HttpStatus.NOT_MODIFIED);
    }

    @Bean
    public InternalResourceViewResolver internalResourceViewResolver() {
        final InternalResourceViewResolver result = new InternalResourceViewResolver();
        result.setViewClass(JstlView.class);
        result.setPrefix("/WEB-INF/jsp/");
        result.setSuffix(".jsp");

        return result;
    }

    @Autowired
    private ServletContext context;

    @RequestMapping(value = "/image/{image:.+}", method = RequestMethod.GET)
    public @ResponseBody
    void getImage(@PathVariable("image") String name, HttpServletResponse response) throws IOException {
        File file = new File(context.getRealPath("/WEB-INF/uploaded") + File.separator + name);
        InputStream in = new FileInputStream(file);
        response.setContentType("image/*");
        response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
        response.setHeader("Content-Length", String.valueOf(file.length()));
        FileCopyUtils.copy(in, response.getOutputStream());
    }

    @RequestMapping(value = "/userinfo/{uid}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> getUser(@PathVariable("uid") int uid) throws IOException {
        if (uid > 0) {
            User user = userRepository.findByUid(uid);
            if (user != null && user.getUid() >= 0) {
                user.setPassword("");
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>("Not found", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/upload", method = RequestMethod.POST, headers = "content-type=multipart/*")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile inputFile) {
        if (!inputFile.isEmpty()) {
            try {
                StringBuilder sb = new StringBuilder();
                sb.append("data:image/png;base64,");
                sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(inputFile.getBytes(), false)));
                return new ResponseEntity<>(sb, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @RequestMapping(value = "/uploadMulti", method = RequestMethod.POST)
    public ResponseEntity<?> multiFileUpload(@RequestParam("files") MultipartFile[] files) {
        List<String> imageNames = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; //next pls
            }
            try {
                StringBuilder sb = new StringBuilder();
                sb.append("data:image/png;base64,");
                sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(file.getBytes(), false)));
                imageNames.add(sb.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (imageNames.isEmpty()) {
            return new ResponseEntity<>("Please select a file to upload", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(imageNames, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/categories", method = RequestMethod.GET)
    public ResponseEntity<List<Category>> getCategories() {
        return new ResponseEntity<>(categoryRepository.findAll(), HttpStatus.OK);
    }

    String generateToken() {
        return Jwts.builder().setSubject(env.getProperty("token.key")).signWith(SignatureAlgorithm.HS256, MacProvider.generateKey()).compact();
    }
}