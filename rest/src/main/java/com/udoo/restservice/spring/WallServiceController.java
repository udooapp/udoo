package com.udoo.restservice.spring;

import com.udoo.dal.entities.User;
import com.udoo.dal.entities.history.OfferHistory;
import com.udoo.dal.entities.history.RequestHistory;
import com.udoo.dal.entities.history.ResponseHistory;
import com.udoo.dal.entities.history.UserHistory;
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

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<?> getOfflineWord(@RequestParam("date") long millis) {
        Date date = new Date(millis);
        Pageable page = new PageRequest(0, 5);
        List<UserHistory> userHistories = userHistoryRepository.findFirst5ByActionAndDateLessThanOrderByDateDesc(0, date, page);
        List<RequestHistory> requestHistories = requestHistoryRepository.findFirst5ByActionAndDateLessThanOrderByDateDesc(0, date, page);
        List<OfferHistory> offerHistories = offerHistoryRepository.findFirst5ByActionAndDateLessThanOrderByDateDesc(0, date, page);
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
                    hist.setTitle(usr.getName() + getUserActionType(uh.getAction()));
                    hist.setPicture(usr.getPicture());
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
                    hist.setTitle(usro.getName() + getOfferActionType(oh.getAction(), off.getTitle()));
                    hist.setPicture(usro.getPicture());
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
                    hist.setTitle(usrr.getName() + getRequestActionType(rh.getAction(), req.getTitle()));
                    hist.setPicture(usrr.getPicture());
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

    private String getUserActionType(int action) {
        switch (action) {
            case 0:
                return " registered on the site";
            case 1:
                return " updated his/her profile";
            case 2:
                return " updated his/her profile picture";
            default:
                return "";
        }
    }

    private String getOfferActionType(int action, String title) {
        switch (action) {
            case 0:
                return " create a new offer with " + title + " title";
            case 1:
                return " updated his/her " + title + " offer";
            case 2:
                return " updated his/her" + title + " offer description";
            case 3:
                return " uploaded a picture  to his/her" + title + " request";
            case 4:
                return " changed the " + title + " offer expiration date";
            case 5:
                return " changed the " + title + " offer location";
            default:
                return "";
        }
    }

    private String getRequestActionType(int action, String title) {
        switch (action) {
            case 0:
                return " create a new offer with " + title + " title";
            case 1:
                return " updated his/her " + title + " request";
            case 2:
                return " updated his/her" + title + " request description";
            case 3:
                return " uploaded a picture  to his/her" + title + " request";
            case 4:
                return " changed the " + title + " request expiration date";
            case 5:
                return " changed the " + title + " request location";
            default:
                return "";
        }
    }
}