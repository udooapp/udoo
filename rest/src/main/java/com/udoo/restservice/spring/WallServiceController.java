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
    private IHistoryRepository historyRepository;

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

    @Override
    @RequestMapping(value = "/public", method = RequestMethod.GET)
    public ResponseEntity<?> getOfflineWall(@RequestParam("last") int lastId) {
        Pageable page = new PageRequest(0, 5);
        return new ResponseEntity<>(this.sort(historyRepository.findAllByActionAndDateLessThanOrderByDateDesc(0, lastId, page)), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<?> getUserWall(ServletRequest request, @RequestParam("last") int lastId) {
        Pageable page = new PageRequest(0, 5);
        int uid = Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString());
        return new ResponseEntity<>(this.sort(historyRepository.findAllUidAndDateLessThan(uid, lastId, page)), HttpStatus.OK);

    }

    private List<ResponseHistory> sort(List<History> history) {
        return merge(history);
    }

    private List<ResponseHistory> merge(List<History> list) {
        List<ResponseHistory> history = new ArrayList<>();
        for (History obj : list) {
            int j = 0;
            while (j < history.size() && history.get(j).getDate().compareTo(obj.getDate()) >= 0) {
                ++j;
            }
            ResponseHistory hist = new ResponseHistory();
            hist.setId(obj.getTid());
            hist.setType(obj.getType());
            hist.setDate(obj.getDate());
            hist.setHid(obj.getHid());
            switch (obj.getType()) {
                case 0:
                    User usr = userRepository.findByUid(hist.getId());
                    hist.setUserName(usr.getName());
                    hist.setPicture(usr.getPicture());
                    hist.setContent(getUserActionType(obj.getHistoryElements(), usr));
                    if (j < history.size()) {
                        history.add(j, hist);
                    } else {
                        history.add(hist);
                    }
                    break;
                case 1:
                    Offer off = offerRepository.findByOid(hist.getId());
                    User usro = userRepository.findByUid(off.getUid());
                    hist.setPicture(usro.getPicture());
                    hist.setUserName(usro.getName());
                    hist.setServiceName(off.getTitle());
                    hist.setContent(getOfferActionType(obj.getHistoryElements(), off));
                    if (j < history.size()) {
                        history.add(j, hist);
                    } else {
                        history.add(hist);
                    }
                    break;
                case 2:
                    Request req = requestRepository.findByRid(hist.getId());
                    User usrr = userRepository.findByUid(req.getUid());
                    hist.setServiceName(req.getTitle());
                    hist.setPicture(usrr.getPicture());
                    hist.setUserName(usrr.getName());
                    hist.setContent(getRequestActionType(obj.getHistoryElements(), req));
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

    private List<WallContent> getUserActionType(List<HistoryElements> list, User user) {
        List<WallContent> content = new ArrayList<>();
        for (HistoryElements element : list) {
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

    private List<WallContent> getOfferActionType(List<HistoryElements> list, Offer offer) {
        List<WallContent> content = new ArrayList<>();
        for (HistoryElements element : list) {
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

    private List<WallContent> getRequestActionType(List<HistoryElements> list, Request request) {
        List<WallContent> content = new ArrayList<>();
        for (HistoryElements element : list) {
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