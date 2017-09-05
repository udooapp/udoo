package com.udoo.restservice.spring;


import com.udoo.dal.entities.*;
import com.udoo.dal.entities.bid.Bid;
import com.udoo.dal.entities.comment.Comment;
import com.udoo.dal.entities.comment.CommentResponse;
import com.udoo.dal.entities.history.History;
import com.udoo.dal.entities.history.HistoryElement;
import com.udoo.dal.entities.request.*;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.*;
import com.udoo.dal.repositories.history.IHistoryElementRepository;
import com.udoo.dal.repositories.history.IHistoryRepository;
import com.udoo.dal.repositories.request.IRequestPictureRepository;
import com.udoo.dal.repositories.request.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
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

import static com.udoo.restservice.security.AuthenticationFilter.USERID;


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
    private IHistoryRepository historyRepository;

    @Resource
    private IHistoryElementRepository historyElementRepository;

    @Resource
    private IBookmarkRepository bookmarkRepository;

    @Autowired
    private IPaymentService paymentService;

    @Override
    @RequestMapping(value = "/user/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImage(ServletRequest req, @RequestBody PicturesRequest image) {
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
            Request requestNew = save.getRequest();
            History hist = new History();
            hist.setDate(new Date());
            hist.setType(2);
            if (requestNew != null && (requestNew.getUid() == user.getUid() || requestNew.getUid() == -1)) {
                int delete = save.getDelete();
                requestNew.setUid(uid);
                if (delete <= -1) {
                    Request requestSaved = new Request();
                    if (requestNew.getRid() != null && requestNew.getRid() > 0) {
                        requestSaved = requestRepository.findByRid(requestNew.getRid());
                    }
                    requestNew = requestRepository.save(requestNew);
                    hist.setTid(requestNew.getRid());
                    hist = historyRepository.save(hist);
                    List<RequestPictures> picturesSaved = requestPictureRepository.findAllByRid(requestNew.getRid());
                    List<PicturesRequest> picturesNew = new ArrayList<>(requestNew.getPicturesRequest());
                    if (requestSaved.getRid() != null && requestSaved.getRid() != -1) {
                        if (!this.saveChanges(requestNew, requestSaved, picturesNew, picturesSaved, hist.getHid())) {
                            historyRepository.deleteByHid(hist.getHid());
                        }
                    } else {
                        HistoryElement histElement = new HistoryElement();
                        histElement.setAction(WallServiceController.NEW);
                        histElement.setBeforeState(requestNew.getCategory() + "");
                        histElement.setHid(hist.getHid());
                        histElement.setAfterState("");
                        historyElementRepository.save(histElement);
                    }
                    comparePictureList(picturesSaved, picturesNew, requestNew.getRid());
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    int d = requestNew.getRid();
                    requestNew.setRid(delete);
                    requestNew.setUid(user.getUid());
                    Request requestSaved = requestRepository.findByRid(d);
                    Request requestCurrent = requestRepository.findByRid(delete);
                    requestRepository.save(requestNew);
                    hist.setTid(requestNew.getRid());
                    hist = historyRepository.save(hist);
                    List<RequestPictures> picturesSaved = requestPictureRepository.findAllByRid(requestNew.getRid());
                    List<PicturesRequest> picturesNew = new ArrayList<>(requestNew.getPicturesRequest());
                    if (requestCurrent != null) {
                        if (!saveChanges(requestNew, requestCurrent, picturesNew, picturesSaved, hist.getHid())) {
                            historyRepository.deleteByHid(hist.getHid());
                        }
                    }
                    comparePictureList(picturesSaved, picturesNew, requestNew.getRid());

                    if (requestSaved != null && requestSaved.getUid() == user.getUid()) {
                        requestRepository.deleteByRid(d);
                        return new ResponseEntity<>("Updated", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("It's not your service", HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                if (requestNew.getUid() < 0 && save.getDelete() <= 0) {
                    requestNew.setUid(uid);
                    requestNew = requestRepository.save(requestNew);
                    hist.setTid(requestNew.getRid());
                    hist = historyRepository.save(hist);
                    HistoryElement histElement = new HistoryElement();
                    histElement.setAction(WallServiceController.NEW);
                    histElement.setBeforeState(requestNew.getCategory() + "");
                    histElement.setHid(hist.getHid());
                    historyElementRepository.save(histElement);
                    return new ResponseEntity<>("Request saved", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect data", HttpStatus.UNAUTHORIZED);
                }
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    private void comparePictureList(List<RequestPictures> picturesSaved, List<PicturesRequest> picturesNew, int rid) {
        for (RequestPictures pic : picturesSaved) {
            int i = 0;
            while (i < picturesNew.size() && picturesNew.get(i).getPrid() != pic.getPrid()) {
                ++i;
            }
            if (i >= picturesNew.size()) {
                requestPictureRepository.deleteByPrid(pic.getPrid());
            } else {
                picturesNew.remove(i);
            }
        }

        for (PicturesRequest pic : picturesNew) {
            RequestPictures picture = requestPictureRepository.findByPrid(pic.getPrid());
            if(picture != null) {
                RequestPictures pic2 = new RequestPictures(picture.getSrc(), rid);
                pic2.setPrid(pic.getPrid());
                requestPictureRepository.save(pic2);
            }
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
                    requestPictureRepository.deleteAllByRid(delete);
                    requestRepository.deleteByRid(delete);
                    deleteHistoryElements(delete);
                    bookmarkRepository.deleteBySidAndType(delete, false);
                }
            }
            if (requestRepository.findByRid(id).getUid() == uid) {
                requestPictureRepository.deleteAllByRid(id);
                int success = requestRepository.deleteByRid(id);
                bookmarkRepository.deleteBySidAndType(id, false);
                deleteHistoryElements(id);
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

    private void deleteHistoryElements(int id) {
        List<History> histories = historyRepository.findAllByTidAndType(id, 1);
        for (History hist : histories) {
            historyElementRepository.deleteByHid(hist.getHid());
            historyRepository.deleteByHid(hist.getHid());
        }
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
            Pageable page = new PageRequest(count / WallServiceController.PAGE_SIZE, WallServiceController.PAGE_SIZE);
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
            List<Comment> comments = commentRepository.findAllBySidAndType(rid, false, new PageRequest(0, WallServiceController.PAGE_SIZE, Sort.Direction.ASC, "creatingdate"));
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
    @RequestMapping(value = "/user/data/dialog", method = RequestMethod.GET)
    public ResponseEntity<?> getRequestDialogData(ServletRequest servletRequest, @RequestParam("rid") int rid) {
        Request request = requestRepository.findByRid(rid);
        int uid = Integer.parseInt(servletRequest.getAttribute(USERID).toString());
        if (request == null) {
            return new ResponseEntity<>("Invalid parameter", HttpStatus.NOT_FOUND);
        } else {
            RequestResponse response = new RequestResponse();
            response.setBookmark(bookmarkRepository.findByUidAndSidAndType(uid, rid, false) != null);
            response.setRequest(request);
            response.setUser(userRepository.findByUid(request.getUid()));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @Override
    @RequestMapping(value = "/data/dialog", method = RequestMethod.GET)
    public ResponseEntity<?> getRequestDialogData(@RequestParam("rid") int rid) {
        Request request = requestRepository.findByRid(rid);
        if (request == null) {
            return new ResponseEntity<>("Invalid parameter", HttpStatus.NOT_FOUND);
        } else {
            RequestResponse response = new RequestResponse();
            response.setRequest(request);
            response.setUser(userRepository.findByUid(request.getUid()));
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

    private boolean saveChanges(Request requestNew, Request requestSaved, List<PicturesRequest> picturesNew, List<RequestPictures> picturesSaved, int hid) {
        boolean update = false;
        for (PicturesRequest pic : picturesNew) {
            int i = 0;
            while (i < picturesSaved.size() && picturesSaved.get(i).getPrid() != pic.getPrid()) {
                ++i;
            }
            if (i >= picturesSaved.size()) {
                update = true;
                HistoryElement histElement = new HistoryElement();
                histElement.setAction(WallServiceController.UPDATED_PICTURE);
                histElement.setBeforeState(pic.getPrid() + "");
                histElement.setAfterState("");
                histElement.setHid(hid);
                historyElementRepository.save(histElement);
            }
        }
        if (!requestNew.getTitle().equals(requestSaved.getTitle())) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_TITLE_OR_NAME);
            histElement.setBeforeState(requestSaved.getTitle());
            histElement.setAfterState(requestNew.getTitle());
            histElement.setHid(hid);
            historyElementRepository.save(histElement);
        }
        if (!requestNew.getDescription().equals(requestSaved.getDescription())) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_DESCRIPTION);
            histElement.setHid(hid);
            histElement.setBeforeState(requestSaved.getDescription());
            histElement.setAfterState(requestNew.getDescription());
            historyElementRepository.save(histElement);
        }
        if (requestNew.getExpirydate().compareTo(requestSaved.getExpirydate()) != 0) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_EXPIRATION_DATE);
            histElement.setHid(hid);
            histElement.setAfterState(requestSaved.getExpirydate().getTime() + "");
            histElement.setBeforeState(requestNew.getExpirydate().getTime() + "");
            historyElementRepository.save(histElement);
        }
        if (!requestNew.getLocation().equals(requestSaved.getLocation())) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_LOCATION);
            histElement.setHid(hid);
            histElement.setBeforeState(requestSaved.getLocation());
            histElement.setAfterState(requestNew.getLocation());
            historyElementRepository.save(histElement);
        }
        if (!requestNew.getJobdate().equals(requestSaved.getJobdate())) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_JOB_DATE);
            histElement.setHid(hid);
            histElement.setBeforeState(requestSaved.getJobdate());
            histElement.setAfterState(requestNew.getJobdate());
            historyElementRepository.save(histElement);
        }
        if (requestNew.getCategory() != requestSaved.getCategory()) {
            update = true;
            HistoryElement histElement = new HistoryElement();
            histElement.setAction(WallServiceController.UPDATED_CATEGORY);
            histElement.setHid(hid);
            histElement.setBeforeState(requestSaved.getCategory() + "");
            histElement.setAfterState(requestNew.getCategory() + "");
            historyElementRepository.save(histElement);
        }
        return update;
    }
}