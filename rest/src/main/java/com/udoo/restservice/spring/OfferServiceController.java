package com.udoo.restservice.spring;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.udoo.dal.entities.Offer;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IOfferServiceController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.io.IOException;
import java.util.List;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/offer")
public class OfferServiceController implements IOfferServiceController {

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IUserRepository userRepository;


    @Override
    @RequestMapping(value = "/user/offer", method = RequestMethod.GET)
    public ResponseEntity<List<Offer>> getAllUserOffer(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            return new ResponseEntity<>(offerRepository.findByUid(user.getUid()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @RequestMapping(value = "/user/deleteoffer", method = RequestMethod.POST)
    public ResponseEntity<String> deleteUserOffer(ServletRequest req, @RequestBody String request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(request);
            Integer id = mapper.convertValue(node.get("id"), Integer.class);
            if (id > 0) {
                if (offerRepository.findByOid(id).getUid() == Integer.parseInt(req.getAttribute(USERID).toString())) {
                    int succes = offerRepository.deleteByOid(id);
                    if (succes > -1) {
                        return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
                }
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Offer> getOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByOid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/user/saveoffer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(ServletRequest request, @RequestBody Offer offer) {
        if (offer != null) {
            User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
            if (user != null) {
                offer.setUid(user.getUid());
                offerRepository.save(offer);
                return new ResponseEntity<>("Saved", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }
}