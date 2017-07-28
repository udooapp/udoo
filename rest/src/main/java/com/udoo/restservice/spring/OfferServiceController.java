package com.udoo.restservice.spring;


import com.udoo.dal.entities.*;
import com.udoo.dal.entities.history.OfferHistory;
import com.udoo.dal.entities.history.OfferHistoryElement;
import com.udoo.dal.entities.offer.*;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IOfferServiceController;
import com.udoo.restservice.payment.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.util.ArrayList;
import java.util.Date;
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

    @Resource
    private IOfferPictureRepository offerPictureRepository;

    @Resource
    private ICommentRepository commentRepository;

    @Resource
    private IBidRepository bidRepository;

    @Resource
    private ICategoryRepository categoryRepository;

    @Resource
    private IOfferHistoryRepository offerHistoryRepository;

    @Resource
    private IOfferHistoryElementRepository offerHistoryElementRepository;

    @Autowired
    private IPaymentService paymentService;

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<List<Offer>> getAllUserOffer(ServletRequest request, @RequestParam("count") int count, @RequestParam("last") int last) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            Pageable page = new PageRequest(count / 5, 5);
            List<Offer> offers = offerRepository.findByUid(user.getUid(), page);
            if (last == -1 || (offers.size() > 0 && offers.get(offers.size() - 1).getOid() != last)) {
                for (Offer offer : offers) {
                    offer.setBids(bidRepository.countBySidAndTypeAndAcceptedLessThan(offer.getOid(), true, 0));
                    if (offer.getPicturesOffer().size() > 1) {
                        offer.setPicturesOffer(offer.getPicturesOffer().subList(0, 1));
                    }
                    if (offer.getDescription().length() > 150) {
                        offer.setDescription(offer.getDescription().substring(0, 150) + "...");
                    }
                }
            } else {
                offers.clear();
            }
            return new ResponseEntity<>(offers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @RequestMapping(value = "/user/delete", method = RequestMethod.POST)
    public ResponseEntity<String> deleteUserOffer(ServletRequest req, @RequestBody DeleteService service) {
        int id = service.getId();
        int delete = service.getDelete();
        int uid = Integer.parseInt(req.getAttribute(USERID).toString());
        if (id > 0) {
            if (delete > 0) {
                if (offerRepository.findByOid(delete).getUid() == uid) {
                    offerRepository.deleteByOid(delete);
                    offerPictureRepository.deleteAllByOid(delete);
                }
            }
            if (offerRepository.findByOid(id).getUid() == uid) {
                int success = offerRepository.deleteByOid(id);
                offerPictureRepository.deleteAllByOid(id);
                if (success > -1) {
                    return new ResponseEntity<>("Offer deleted", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }


    @Override
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserOffer(@PathVariable("id") int id) {
        UserOffer offer = new UserOffer();
        offer.setOffer(offerRepository.findByOid(id));
        List<Bid> bids = bidRepository.findAllBySidAndType(id, true);
        if (bids.size() > 0) {
            User user;
            Payment payment;
            for (Bid bid : bids) {
                payment = paymentService.getStatusServicePayment((int) bid.getUid(), (int) bid.getSid(), bid.isType());
                if (payment != null) {
                    bid.setPaymentState(payment.getState());
                }
                user = userRepository.findByUid((int) bid.getUid());
                bid.setName(user.getName());
                bid.setPicture(user.getPicture());
            }
        }
        offer.setCategories(categoryRepository.findAll());
        offer.setBids(bids);

        return new ResponseEntity<>(offer, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/data/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getOfferData(@PathVariable("id") int id) {
        Offer offer = offerRepository.findByOid(id);
        if (offer == null) {
            return new ResponseEntity<>("Invalid parameter", HttpStatus.NOT_FOUND);
        } else {
            OfferResponse response = new OfferResponse();
            offer.setBids(-1);
            response.setOffer(offer);
            response.setUser(userRepository.findByUid(offer.getUid()));
            List<Comment> comments = commentRepository.findAllBySidAndType(id, true, new PageRequest(0, 5, Sort.Direction.DESC, "creatingdate"));
            List<CommentResponse> list = new ArrayList<>();
            if (comments != null && !comments.isEmpty()) {
                User usr;
                for (Comment comment : comments) {
                    usr = userRepository.findByUid((int) comment.getUid());
                    if (usr != null) {
                        CommentResponse resp = new CommentResponse();
                        resp.setCommentMessage(comment.getComment());
                        resp.setName(usr.getName());
                        resp.setDate(comment.getDate());
                        resp.setPicture(usr.getPicture());
                        resp.setUid((int) comment.getUid());
                        list.add(resp);
                    } else {
                        comments.remove(comment);
                    }
                }
            }
            response.setComments(list);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @Override
    @RequestMapping(value = "/user/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createOffer(ServletRequest request, @RequestBody String image) {
        if (image != null) {
            User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
            if (user != null) {
                Offer offer = new Offer();
                offer.setUid(user.getUid());
                offer = offerRepository.save(offer);
                OfferPictures pic = offerPictureRepository.save(new OfferPictures(image, offer.getOid()));
                if (pic != null) {
                    return new ResponseEntity<>(new DeleteService(pic.getPoid(), offer.getOid()), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong! Try again", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    @RequestMapping(value = "/user/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImage(ServletRequest req, PicturesOffer image) {
        if (image != null) {
            OfferPictures pic = offerPictureRepository.save(new OfferPictures(image.getSrc(), image.getPoid()));
            if (pic != null) {
                return new ResponseEntity<>(pic.getPoid(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Something wrong! Try again", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/user/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveOffer(ServletRequest request, @RequestBody OfferSave save) {
        if (save != null) {
            int uid = Integer.parseInt(request.getAttribute(USERID).toString());
            User user = userRepository.findByUid(uid);
            Offer offerNew = save.getOffer();
            OfferHistory hist = new OfferHistory();
            hist.setDate(new Date());
            if (offerNew != null && (offerNew.getUid() == user.getUid() || offerNew.getUid() == -1)) {
                int delete = save.getDelete();
                offerNew.setUid(uid);
                if (delete <= -1) {
                    Offer offerSaved = new Offer();
                    if (offerNew.getOid() != null && offerNew.getOid() > -1) {
                        offerSaved = offerRepository.findByOid(offerNew.getOid());
                    }
                    offerNew = offerRepository.save(offerNew);
                    hist.setOid(offerNew.getOid());
                    hist = offerHistoryRepository.save(hist);
                    List<OfferPictures> picturesSaved = offerPictureRepository.findAllByOid(offerNew.getOid());
                    List<PicturesOffer> picturesNew = new ArrayList<>(offerNew.getPicturesOffer());

                    if (offerSaved.getOid() != -1) {
                        this.saveChanges(offerNew, offerSaved, picturesNew, picturesSaved, hist.getOhid());
                    } else {
                        OfferHistoryElement histElement = new OfferHistoryElement();
                        histElement.setAction(WallServiceController.NEW);
                        histElement.setOhid(hist.getOhid());
                        offerHistoryElementRepository.save(histElement);
                    }
                    for (OfferPictures pic : picturesSaved) {
                        int i = 0;
                        while (i < picturesNew.size() && picturesNew.get(i).getPoid() != pic.getPoid()) {
                            ++i;
                        }
                        if (i >= picturesNew.size()) {
                            offerPictureRepository.deleteByPoid(pic.getPoid());
                        }
                    }
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    int d = offerNew.getOid();
                    offerNew.setOid(delete);
                    offerNew.setUid(user.getUid());
                    Offer offerSaved = offerRepository.findByOid(d);
                    offerNew = offerRepository.save(offerNew);
                    hist.setOid(offerNew.getOid());
                    hist = offerHistoryRepository.save(hist);

                    List<OfferPictures> picturesSaved = offerPictureRepository.findAllByOid(offerNew.getOid());
                    List<PicturesOffer> picturesNew = new ArrayList<>(offerNew.getPicturesOffer());

                    if (offerSaved != null && offerSaved.getUid() > 0) {
                        saveChanges(offerNew, offerSaved, picturesNew, picturesSaved, hist.getOhid());
                    }

                    for (OfferPictures pic : picturesSaved) {
                        int i = 0;
                        while (i < picturesNew.size() && picturesNew.get(i).getPoid() != pic.getPoid()) {
                            ++i;
                        }
                        if (i >= picturesNew.size()) {
                            offerPictureRepository.deleteByPoid(pic.getPoid());
                        } else {
                            picturesNew.remove(i);
                        }
                    }

                    for (PicturesOffer pic : picturesNew) {
                        OfferPictures pic2 = new OfferPictures(pic.getSrc(), offerNew.getOid());
                        pic2.setPoid(pic.getPoid());
                        offerPictureRepository.save(pic2);
                    }
                    if (offerSaved != null && offerSaved.getUid() == user.getUid()) {
                        offerRepository.deleteByOid(d);
                        return new ResponseEntity<>("Saved", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("It's not your service", HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                if (offerNew != null && offerNew.getUid() < 0 && save.getDelete() <= 0) {
                    offerNew.setUid(uid);
                    offerNew = offerRepository.save(offerNew);
                    hist.setOid(offerNew.getOid());
                    hist.setDate(new Date());
                    hist = offerHistoryRepository.save(hist);
                    OfferHistoryElement histElement = new OfferHistoryElement();
                    histElement.setAction(WallServiceController.NEW);
                    histElement.setOhid(hist.getOhid());
                    histElement.setOhid(hist.getOhid());
                    offerHistoryElementRepository.save(histElement);
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect data", HttpStatus.UNAUTHORIZED);
                }
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    private void saveChanges(Offer offerNew, Offer offerSaved, List<PicturesOffer> picturesNew, List<OfferPictures> picturesSaved, int ohid) {
        for (PicturesOffer pic : picturesNew) {
            int i = 0;
            while (i < picturesSaved.size() && picturesSaved.get(i).getPoid() != pic.getPoid()) {
                ++i;
            }
            if (i >= picturesSaved.size()) {
                OfferHistoryElement histElement = new OfferHistoryElement();
                histElement.setAction(WallServiceController.UPDATED_PICTURE);
                histElement.setChanges(pic.getPoid() + "");
                histElement.setOhid(ohid);
                offerHistoryElementRepository.save(histElement);
            }
        }
        if (!offerNew.getTitle().equals(offerSaved.getTitle())) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_TITLE_OR_NAME);
            histElement.setChanges(offerSaved.getTitle());
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
        if (!offerNew.getDescription().equals(offerSaved.getDescription())) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_DESCRIPTION);
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
        if (!offerNew.getAvailability().equals(offerSaved.getAvailability())) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_AVAILABILITY);
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
        if (offerNew.getExpirydate().compareTo(offerSaved.getExpirydate()) != 0) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_EXPIRATION_DATE);
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
        if (!offerNew.getLocation().equals(offerSaved.getLocation())) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_LOCATION);
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
        if (offerNew.getCategory() != offerSaved.getCategory()) {
            OfferHistoryElement histElement = new OfferHistoryElement();
            histElement.setAction(WallServiceController.UPDATED_CATEGORY);
            histElement.setOhid(ohid);
            offerHistoryElementRepository.save(histElement);
        }
    }
}