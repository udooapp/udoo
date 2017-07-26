package com.udoo.restservice.spring;


import com.udoo.dal.entities.*;
import com.udoo.dal.entities.history.RequestHistory;
import com.udoo.dal.entities.request.*;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IRequestServiceController;
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
@RequestMapping("/request")
public class RequestServiceController implements IRequestServiceController {

    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private ICommentRepository commentRepository;

    @Resource
    private ICategoryRepository categoryRepository;

    @Resource
    private IRequestPictureRepository requestPictureRepository;

    @Resource
    private IBidRepository bidRepository;

    @Resource
    private IRequestHistoryRepository requestHistoryRepository;

    @Autowired
    private IPaymentService paymentService;

    @Override
    @RequestMapping(value = "/user/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImage(ServletRequest req, PicturesRequest image) {
        if (image != null) {
            RequestPictures pic = requestPictureRepository.save(new RequestPictures(image.getSrc(), image.getPrid()));
            if (pic != null) {
                return new ResponseEntity<>(pic.getPrid(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Something wrong! Try again", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
    }

    @Override
    @RequestMapping(value = "/user/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(ServletRequest req, @RequestBody RequestSave save) {
        if (save != null) {
            int uid = Integer.parseInt(req.getAttribute(USERID).toString());
            User user = userRepository.findByUid(uid);
            Request request = save.getRequest();
            if (user != null && request.getUid() == user.getUid()) {
                int delete = save.getDelete();
                RequestHistory hist = new RequestHistory();

                hist.setDate(new Date());
                hist.setRid(request.getRid());
                if (delete <= -1) {
                    request = requestRepository.save(request);
                    List<RequestPictures> pictures = requestPictureRepository.findAllByRid(request.getRid());
                    List<PicturesRequest> currentPictures = new ArrayList<>(request.getPicturesRequest());
                    hist.setAction(0);
                    for (RequestPictures pic : pictures) {
                        int i = 0;
                        while (i < currentPictures.size() && currentPictures.get(i).getPrid() != pic.getPrid()) {
                            ++i;
                        }
                        if (i >= currentPictures.size()) {
                            requestPictureRepository.deleteByPrid(pic.getPrid());
                        }
                    }
                    requestHistoryRepository.save(hist);
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    int d = request.getRid();
                    request.setRid(delete);
                    request.setUid(user.getUid());
                    Request request2 = requestRepository.findByRid(d);
                    requestRepository.save(request);
                    List<RequestPictures> pictures = requestPictureRepository.findAllByRid(request.getRid());
                    List<PicturesRequest> currentPictures = new ArrayList<>(request.getPicturesRequest());
                    int changes = 0;
                    if(pictures.size() < currentPictures.size()){
                        hist.setAction(3);
                        ++changes;
                    }
                    if(request2.getDescription().length() != request.getDescription().length()) {
                        hist.setAction(2);
                        ++changes;
                    }
                    if(request2.getExpirydate()!= request.getExpirydate()) {
                        hist.setAction(4);
                        ++changes;
                    }
                    if(!request2.getLocation().equals(request.getLocation())) {
                        hist.setAction(5);
                        ++changes;
                    }
                    if(changes > 1 || changes == 0){
                        hist.setAction(1);
                    }
                    for (RequestPictures pic : pictures) {
                        int i = 0;
                        while (i < currentPictures.size() && currentPictures.get(i).getPrid() != pic.getPrid()) {
                            ++i;
                        }
                        if (i >= currentPictures.size()) {
                            requestPictureRepository.deleteByPrid(pic.getPrid());
                        } else {
                            currentPictures.remove(i);
                        }
                    }

                    for (PicturesRequest pic : currentPictures) {
                        RequestPictures pic2 = new RequestPictures(pic.getSrc(), request.getRid());
                        pic2.setPrid(pic.getPrid());
                        requestPictureRepository.save(pic2);
                    }

                    if (request2 != null & request2.getUid() == user.getUid()) {
                        requestRepository.deleteByRid(d);

                        requestHistoryRepository.save(hist);
                        return new ResponseEntity<>("Updated", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("It's not your service", HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                if (request.getUid() < 0 && save.getDelete() <= 0) {
                    request.setUid(uid);
                    request = requestRepository.save(request);
                    RequestHistory hist = new RequestHistory();
                    hist.setAction(0);
                    hist.setDate(new Date());
                    hist.setRid(request.getRid());
                    requestHistoryRepository.save(hist);
                    return new ResponseEntity<>("Request saved", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect data", HttpStatus.UNAUTHORIZED);
                }
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    @RequestMapping(value = "/user/delete", method = RequestMethod.POST)
    public ResponseEntity<String> deleteUserRequest(ServletRequest req, @RequestBody DeleteService service) {
        int id = service.getId();
        int delete = service.getDelete();
        int uid = Integer.parseInt(req.getAttribute(USERID).toString());
        if (id > 0) {
            if (delete > 0) {
                if (requestRepository.findByRid(delete).getUid() == uid) {
                    requestRepository.deleteByRid(delete);
                    requestPictureRepository.deleteAllByRid(delete);
                }
            }
            if (requestRepository.findByRid(id).getUid() == uid) {
                int success = requestRepository.deleteByRid(id);
                requestPictureRepository.deleteAllByRid(id);
                if (success > -1) {
                    return new ResponseEntity<>("Request deleted", HttpStatus.OK);
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
    @RequestMapping(value = "/user/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createRequest(ServletRequest req, @RequestBody String image) {
        if (image != null) {
            User user = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
            if (user != null) {
                Request request = new Request();
                request.setUid(user.getUid());
                request = requestRepository.save(request);
                RequestPictures pic = requestPictureRepository.save(new RequestPictures(image, request.getRid()));
                if (pic != null) {
                    return new ResponseEntity<>(new DeleteService(pic.getPrid(), request.getRid()), HttpStatus.OK);
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
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<List<Request>> getAllUserRequest(ServletRequest request, @RequestParam("count") int count, @RequestParam("last") int last) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            Pageable page = new PageRequest(count / 5, 5);
            List<Request> requests = requestRepository.findByUid(user.getUid(), page);
            if (last == -1 || (requests.size() > 0 && requests.get(requests.size() - 1).getRid() != last)) {
                for (Request req : requests) {
                    req.setBids(bidRepository.countBySidAndTypeAndAcceptedLessThan(req.getRid(), false, 0));
                    if (req.getPicturesRequest() != null && req.getPicturesRequest().size() > 1) {
                        req.setPicturesRequest(req.getPicturesRequest().subList(0, 1));
                    }
                    if (req.getDescription().length() > 150) {
                        req.setDescription(req.getDescription().substring(0, 150) + "...");
                    }
                }
            } else {
                requests.clear();
            }
            return new ResponseEntity<>(requests, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @Override
    @RequestMapping(value = "/data/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getRequestData(@PathVariable("id") int rid) {
        Request request = requestRepository.findByRid(rid);
        if (request == null) {
            return new ResponseEntity<>("Invalid parameter", HttpStatus.NOT_FOUND);
        } else {
            RequestResponse response = new RequestResponse();
            response.setRequest(request);
            response.setUser(userRepository.findByUid(request.getUid()));
            ;
            List<Comment> comments = commentRepository.findAllBySidAndType(rid, false, new PageRequest(0, 5, Sort.Direction.ASC, "creatingdate"));
            List<CommentResponse> list = new ArrayList<>();
            if (comments != null && !comments.isEmpty()) {
                User usr;
                for (Comment comment : comments) {
                    usr = userRepository.findByUid((int) comment.getUid());
                    if (usr != null) {
                        CommentResponse resp = new CommentResponse();
                        resp.setCommentMessage(comment.getComment());
                        resp.setName(usr.getName());
                        resp.setPicture(usr.getPicture());
                        resp.setUid((int) comment.getUid());
                        resp.setDate(comment.getDate());
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
    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserRequest(@PathVariable("id") int id) {
        UserRequest request = new UserRequest();
        request.setRequest(requestRepository.findByRid(id));
        List<Bid> bids = bidRepository.findAllBySidAndType(id, false);
        request.setCategories(categoryRepository.findAll());
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
        request.setBids(bids);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }
}