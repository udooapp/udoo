package com.udoo.restservice.spring;

import com.udoo.dal.entities.WallContent;
import com.udoo.dal.entities.history.*;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IWallServiceController;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/wall")
public class WallServiceController implements IWallServiceController {
    public static final int NEW = 0;
    public static final int UPDATED_DESCRIPTION = 2;
    public static final int UPDATED_PICTURE = 3;
    public static final int UPDATED_EXPIRATION_DATE = 4;
    public static final int UPDATED_LOCATION = 5;
    public static final int UPDATED_TITLE_OR_NAME = 6;
    public static final int UPDATED_AVAILABILITY = 7;
    public static final int UPDATED_JOB_DATE = 8;
    public static final int UPDATED_CATEGORY = 9;
    public static final int UPDATED_PHONE_NUMBER = 10;
    public static final int UPDATED_EMAIL_ADDRESS = 11;

    @Resource
    private IOfferHistoryRepository offerHistoryRepository;

    @Resource
    private IRequestHistoryRepository requestHistoryRepository;

    @Resource
    private IUserHistoryRepository userHistoryRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferPictureRepository offerPictureRepository;

    @Resource
    private IRequestPictureRepository requestPictureRepository;

    @Resource
    private IUserHistoryElementRepository userHistoryElementRepository;

    @Resource
    private IOfferHistoryElementRepository offerHistoryElementRepository;

    @Resource
    private IRequestHistoryElementRepository requestHistoryElementRepository;

    @Override
    @RequestMapping(value = "/public", method = RequestMethod.GET)
    public ResponseEntity<?> getOfflineWall(@RequestParam("date") long millis) {
        Date date = new Date(millis);
        Pageable page = new PageRequest(0, 5);
        List<UserHistory> userHistories = userHistoryRepository.findAllByActionAndDateLessThanOrderByDateDesc(0, date, page);
        List<RequestHistory> requestHistories = requestHistoryRepository.findAllByActionAndDateLessThanOrderByDateDesc(0, date, page);
        List<OfferHistory> offerHistories = offerHistoryRepository.findAllByActionAndDateLessThanOrderByDateDesc(0, date, page);
        return new ResponseEntity<>(this.sort(userHistories, offerHistories, requestHistories), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<?> getUserWall(ServletRequest request, @RequestParam("date") long millis) {
        Date date = new Date(millis);
        Pageable page = new PageRequest(0, 5);
        int uid = Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString());
        List<UserHistory> userHistories = userHistoryRepository.findAllByUidAndDateLessThan(uid, date, page);
        List<RequestHistory> requestHistories = requestHistoryRepository.findAllByUidAndDateLessThan(uid, date, page);
        List<OfferHistory> offerHistories = offerHistoryRepository.findAllByUidAndDateLessThan(uid, date, page);
        return new ResponseEntity<>(this.sort(userHistories, offerHistories, requestHistories), HttpStatus.OK);

    }

    private List<ResponseHistory> sort(List<UserHistory> uhistory, List<OfferHistory> ohistory, List<RequestHistory> rhistory) {
        List<ResponseHistory> history = new ArrayList<>();
        history = merge(history, uhistory, 0);
        history = merge(history, ohistory, 1);
        history = merge(history, rhistory, 2);
        return history;
    }

    private List<ResponseHistory> merge(List<ResponseHistory> history, List list, int type) {
        for (Object obj : list) {
            int j = 0;
            ResponseHistory hist = new ResponseHistory();
            while (j < history.size() && history.get(j).getDate().compareTo(type == 0 ? ((UserHistory) obj).getDate() : type == 1 ? ((OfferHistory) obj).getDate() : ((RequestHistory) obj).getDate()) >= 0) {
                ++j;
            }
            switch (type) {
                case 0:
                    UserHistory uh = (UserHistory) obj;
                    hist.setId(uh.getUid());
                    hist.setType(0);
                    User usr = userRepository.findByUid(hist.getId());
                    hist.setDate(uh.getDate());
                    hist.setUserName(usr.getName());
                    hist.setPicture(usr.getPicture());
                    hist.setContent(getUserActionType(uh.getUserHistoryElements(), usr));
                    if (j < history.size()) {
                        history.add(j, hist);
                    } else {
                        history.add(hist);
                    }
                    break;
                case 1:
                    OfferHistory oh = (OfferHistory) obj;
                    hist.setId(oh.getOid());
                    hist.setType(1);
                    Offer off = offerRepository.findByOid(hist.getId());
                    hist.setDate(oh.getDate());
                    User usro = userRepository.findByUid(off.getUid());
                    hist.setPicture(usro.getPicture());
                    hist.setUserName(usro.getName());
                    hist.setServiceName(off.getTitle());
                    hist.setContent(getOfferActionType(oh.getOfferHistoryElements(), off));
                    if (j < history.size()) {
                        history.add(j, hist);
                    } else {
                        history.add(hist);
                    }
                    break;
                case 2:
                    RequestHistory rh = (RequestHistory) obj;
                    hist.setId(rh.getRid());
                    hist.setType(2);
                    Request req = requestRepository.findByRid(hist.getId());
                    hist.setDate(rh.getDate());
                    User usrr = userRepository.findByUid(req.getUid());
                    hist.setServiceName(req.getTitle());
                    hist.setPicture(usrr.getPicture());
                    hist.setUserName(usrr.getName());
                    hist.setContent(getRequestActionType(rh.getRequestHistoryElements(), req));
                    if (j < history.size()) {
                        history.add(j, hist);
                    } else {
                        history.add(hist);
                    }
                    break;
            }
        }
        return history;
    }

    private List<WallContent> getUserActionType(List<UserHistoryElements> list, User user) {
        List<WallContent> content = new ArrayList<>();
        for (UserHistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case UPDATED_PICTURE:
                    wallContent.setContent(user.getPicture());
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setContent(element.getChanges() + " to " + user.getName());
                    break;
                case UPDATED_PHONE_NUMBER:
                    wallContent.setContent(user.getPhone());
                    break;
                case UPDATED_EMAIL_ADDRESS:
                    wallContent.setContent(user.getEmail());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }

    private List<WallContent> getOfferActionType(List<OfferHistoryElements> list, Offer offer) {
        List<WallContent> content = new ArrayList<>();
        for (OfferHistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case UPDATED_DESCRIPTION:
                    wallContent.setContent(offer.getDescription());
                    break;
                case UPDATED_PICTURE:
                    wallContent.setContent(offerPictureRepository.findByPoid(Integer.parseInt(element.getChanges())).getSrc());
                    break;
                case UPDATED_EXPIRATION_DATE:
                    wallContent.setContent(offer.getExpirydate().getTime() + "");
                    break;
                case UPDATED_LOCATION:
                    wallContent.setContent(offer.getLocation());
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setContent(element.getChanges());
                    break;
                case UPDATED_CATEGORY:
                    wallContent.setContent(offer.getCategory() + "");
                    break;
                case UPDATED_AVAILABILITY:
                    wallContent.setContent(offer.getAvailability());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }

    private List<WallContent> getRequestActionType(List<RequestHistoryElements> list, Request request) {
        List<WallContent> content = new ArrayList<>();
        for (RequestHistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case UPDATED_DESCRIPTION:
                    wallContent.setContent(request.getDescription());
                    break;
                case UPDATED_PICTURE:
                    wallContent.setContent(requestPictureRepository.findByPrid(Integer.parseInt(element.getChanges())).getSrc());
                    break;
                case UPDATED_EXPIRATION_DATE:
                    wallContent.setContent(request.getExpirydate().getTime() + "");
                    break;
                case UPDATED_LOCATION:
                    wallContent.setContent(request.getLocation());
                    break;
                case UPDATED_CATEGORY:
                    wallContent.setContent(request.getCategory() + "");
                    break;
                case UPDATED_JOB_DATE:
                    wallContent.setContent(request.getJobdate());
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setContent(element.getChanges());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }
}