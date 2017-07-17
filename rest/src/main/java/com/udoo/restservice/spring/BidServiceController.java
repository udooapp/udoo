package com.udoo.restservice.spring;


import com.udoo.dal.entities.Bid;
import com.udoo.dal.entities.BidResponse;
import com.udoo.dal.entities.CategoryResult;
import com.udoo.dal.entities.User;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IBidServiceController;
import com.udoo.restservice.payment.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import java.util.ArrayList;
import java.util.List;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/bid")
public class BidServiceController implements IBidServiceController {

    @Resource
    private IBidRepository bidRepository;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Autowired
    private IPaymentService paymentService;

    @Override
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public ResponseEntity<?> saveBid(ServletRequest req, @RequestBody Bid bid) {
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
    public ResponseEntity<?> saveResponseBid(ServletRequest req, @RequestBody CategoryResult result) {
        Bid bd = bidRepository.findAllByBid(result.getId());
        bd.setAccepted((int) result.getResult());
        bidRepository.save(bd);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<?> getUserBids(ServletRequest req, @RequestParam("count") int count, @RequestParam("last") int last) {
        User currentUser = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
        if (currentUser != null && currentUser.getUid() > 0) {
            List<Bid> bids = bidRepository.findAllByUidOrderByBidDesc(currentUser.getUid(), new PageRequest(count / 5, 5));
            List<BidResponse> response = new ArrayList<>();
            if (last == -1 || (bids.size() > 0 && bids.get(bids.size() - 1).getBid() != last)) {
                for (Bid bid : bids) {
                    BidResponse resp = new BidResponse();
                    resp.setBid(bid.getBid());
                    resp.setStatus(bid.getAccepted());
                    resp.setPrice(bid.getPrice());
                    resp.setDescription(bid.getDescription());
                    resp.setType(bid.isType());
                    resp.setSid(bid.getSid());
                    if (resp.isType()) {
                        Offer offer = offerRepository.findByOid((int) resp.getSid());
                        resp.setTitle(offer.getTitle());
                        if (offer.getPicturesOffer() != null && offer.getPicturesOffer().size() > 0) {
                            resp.setImage(offer.getPicturesOffer().get(0).getSrc());
                        }
                        resp.setName(userRepository.findByUid(offer.getUid()).getName());
                    } else {
                        Request request = requestRepository.findByRid((int) resp.getSid());
                        resp.setTitle(request.getTitle());
                        if (request.getPicturesRequest() != null && request.getPicturesRequest().size() > 0) {
                            resp.setImage(request.getPicturesRequest().get(0).getSrc());
                        }
                        resp.setName(userRepository.findByUid(request.getUid()).getName());
                    }
                    response.add(resp);
                }
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>("Something wrong", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/provider", method = RequestMethod.GET)
    public ResponseEntity<?> getProviderBids(ServletRequest req, @RequestParam("count") int count, @RequestParam("last") int last) {
        User currentUser = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
        if (currentUser != null && currentUser.getUid() > 0) {
            List<Bid> bids = bidRepository.findAllByProviderId(currentUser.getUid(), new PageRequest(count / 5, 5, Sort.Direction.DESC));
            List<BidResponse> response = new ArrayList<>();
            if (last == -1 || (bids.size() > 0 && bids.get(bids.size() - 1).getBid() != last)) {
                for (int i = 0; i < bids.size(); ++i) {
                    BidResponse resp = new BidResponse();
                    resp.setBid(bids.get(i).getBid());
                    resp.setStatus(bids.get(i).getAccepted());
                    resp.setPrice(bids.get(i).getPrice());
                    resp.setDescription(bids.get(i).getDescription());
                    resp.setType(bids.get(i).isType());
                    resp.setSid(bids.get(i).getSid());
                    if (resp.isType()) {
                        Offer offer = offerRepository.findByOid((int) resp.getSid());
                        resp.setTitle(offer.getTitle());
                        if (offer.getPicturesOffer() != null && offer.getPicturesOffer().size() > 0) {
                            resp.setImage(offer.getPicturesOffer().get(0).getSrc());
                        }
                    } else {
                        Request request = requestRepository.findByRid((int) resp.getSid());
                        resp.setTitle(request.getTitle());
                        if (request.getPicturesRequest() != null && request.getPicturesRequest().size() > 0) {
                            resp.setImage(request.getPicturesRequest().get(0).getSrc());
                        }
                    }
                    resp.setName(userRepository.findByUid((int) bids.get(i).getUid()).getName());
                    response.add(resp);
                }
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>("Something wrong", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/cancel", method = RequestMethod.GET)
    public ResponseEntity<?> deleteBid(ServletRequest req, @RequestParam("bid") long bid) {
        Bid bd = bidRepository.findAllByBid((int) bid);
        if (bd != null) {
            bidRepository.deleteByBid((int)bid);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        return new ResponseEntity<>("Invalid bid", HttpStatus.NOT_FOUND);

    }

    @Override
    @RequestMapping(value = "/confirm", method = RequestMethod.GET)
    public ResponseEntity<?> confirmBid(ServletRequest req, @RequestParam("bid") int bid) {
        Bid bd = bidRepository.findAllByBid(bid);
        if (bd != null && Integer.parseInt(req.getAttribute(USERID).toString()) == bd.getUid()) {
            if(bd.getAccepted() == 1) {
                bd.setAccepted(2);
                bidRepository.save(bd);
                return new ResponseEntity<>("Confirmed", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Your bid is not accepted", HttpStatus.UNAUTHORIZED);
            }

        }
        return new ResponseEntity<>("Invalid bid", HttpStatus.NOT_FOUND);
    }
}