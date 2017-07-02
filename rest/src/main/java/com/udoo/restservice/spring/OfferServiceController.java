package com.udoo.restservice.spring;



import com.udoo.dal.entities.Comment;
import com.udoo.dal.entities.CommentResponse;
import com.udoo.dal.entities.DeleteService;
import com.udoo.dal.entities.offer.*;
import com.udoo.dal.entities.User;
import com.udoo.dal.repositories.ICommentRepository;
import com.udoo.dal.repositories.IOfferPictureRepository;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IOfferServiceController;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<List<Offer>> getAllUserOffer(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            List<Offer> offers = offerRepository.findByUid(user.getUid());
            if (offers != null) {
                for (Offer offer : offers) {
                    if (offer.getPicturesOffer().size() > 1) {
                        offer.setPicturesOffer(offer.getPicturesOffer().subList(0, 1));
                    }
                }
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
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getOffer(@PathVariable("id") int id) {
        return new ResponseEntity<>(offerRepository.findByOid(id), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/data/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getOfferData(@PathVariable("id") int id) {
        Offer offer = offerRepository.findByOid(id);
        if (offer == null) {
            return new ResponseEntity<>("Invalid parameter", HttpStatus.NOT_FOUND);
        } else {
            OfferResponse response = new OfferResponse();
            response.setOffer(offer);
            response.setUser(userRepository.findByUid(offer.getUid()));
            List<Comment> comments = commentRepository.findAllBySidAndType(id, true, new PageRequest(0, 5, Sort.Direction.ASC, "creatingdate"));
            List<CommentResponse> list = new ArrayList<>();
            if(comments != null && !comments.isEmpty()){
                User usr;
                for(Comment comment : comments){
                    usr = userRepository.findByUid((int)comment.getUid());
                    if(usr != null){
                        CommentResponse resp = new CommentResponse();
                        resp.setCommentMessage(comment.getComment());
                        resp.setName(usr.getName());
                        resp.setDate(comment.getDate());
                        resp.setPicture(usr.getPicture());
                        resp.setUid((int)comment.getUid());
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
        if (image!= null) {
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
        if(image != null){
            OfferPictures pic = offerPictureRepository.save(new OfferPictures(image.getSrc(), image.getPoid()));
            if (pic!= null) {
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
            Offer offer = save.getOffer();
            if (user != null && save.getOffer().getUid() == user.getUid()) {
                int delete = save.getDelete();
                if(delete <= -1){
                    offerRepository.save(offer);
                    List<OfferPictures> pictures = offerPictureRepository.findAllByOid(offer.getOid());
                    List<PicturesOffer> currentPictures = new ArrayList<>(offer.getPicturesOffer());
                    for(OfferPictures pic :pictures){
                        int i = 0;
                        while(i < currentPictures.size() && currentPictures.get(i).getPoid() != pic.getPoid()){
                            ++i;
                        }
                        if(i>=currentPictures.size()){
                            offerPictureRepository.deleteByPoid(pic.getPoid());
                        }
                    }
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    int d = offer.getOid();
                    offer.setOid(delete);
                    offer.setUid(user.getUid());
                    Offer offer2 = offerRepository.findByOid(d);
                    offerRepository.save(offer);

                    List<OfferPictures> pictures = offerPictureRepository.findAllByOid(offer.getOid());
                    List<PicturesOffer> currentPictures = new ArrayList<>(offer.getPicturesOffer());
                    for(OfferPictures pic :pictures){
                        int i = 0;
                        while(i < currentPictures.size() && currentPictures.get(i).getPoid() != pic.getPoid()){
                            ++i;
                        }
                        if(i>=currentPictures.size()){
                            offerPictureRepository.deleteByPoid(pic.getPoid());
                        }else {
                            currentPictures.remove(i);
                        }
                    }

                    for(PicturesOffer pic : currentPictures){
                        OfferPictures pic2 = new OfferPictures(pic.getSrc(), offer.getOid());
                        pic2.setPoid(pic.getPoid());
                        offerPictureRepository.save(pic2);
                    }
                    System.out.println("Size:" + offer.getPicturesOffer().size());
                    if (offer2 != null && offer2.getUid() == user.getUid()) {
                        offerRepository.deleteByOid(d);
                        return new ResponseEntity<>("Saved", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("It's not your service", HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                if(offer.getUid() < 0 && save.getDelete() <= 0){
                    offer.setUid(uid);
                    offerRepository.save(offer);
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                }else {
                    return new ResponseEntity<>("Incorrect data", HttpStatus.UNAUTHORIZED);
                }
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }
}