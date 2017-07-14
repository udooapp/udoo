package com.udoo.restservice.spring;


import com.udoo.dal.entities.Bid;
import com.udoo.dal.entities.CategoryResult;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IPidServiceController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/bid")
public class BidServiceController implements IPidServiceController {

    @Resource
    IBidRepository bidRepository;

    @Override
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public ResponseEntity<?> savePid(ServletRequest req, @RequestBody Bid bid) {
        long uid = Long.parseLong(req.getAttribute(USERID).toString());
        bid.setUid(uid);
        bid = bidRepository.save(bid);
        if (bid != null) {
            return new ResponseEntity<>("Saved", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Something wrong", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @RequestMapping(value = "/response", method = RequestMethod.POST)
    public ResponseEntity<?> saveResponsePid(ServletRequest req,@RequestBody CategoryResult result) {
        System.out.println("RESULT");
        System.out.println(result);
        Bid bd = bidRepository.findAllByBid(result.getId());
        bd.setAccepted((int)result.getResult());
        bidRepository.save(bd);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}