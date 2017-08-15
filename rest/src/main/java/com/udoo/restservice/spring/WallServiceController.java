package com.udoo.restservice.spring;

import com.udoo.dal.entities.WallContent;
import com.udoo.dal.entities.history.*;
import com.udoo.dal.entities.offer.OfferPictures;
import com.udoo.dal.entities.request.RequestPictures;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.repositories.*;
import com.udoo.restservice.IWallServiceController;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.text.SimpleDateFormat;
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
    private ICategoryRepository categoryRepository;

    @Resource
    private IOfferPictureRepository offerPictureRepository;

    @Resource
    private IRequestPictureRepository requestPictureRepository;

    @Override
    @RequestMapping(value = "/public", method = RequestMethod.GET)
    public ResponseEntity<?> getOfflineWall(@RequestParam("last") int lastId) {
        Pageable page = new PageRequest(0, 5);
        if (lastId == 0) {
            lastId = Integer.MAX_VALUE;
        }
        return new ResponseEntity<>(this.merge(historyRepository.findAllByActionAndDateLessThanOrderByDateDesc(0, lastId, page)), HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity<?> getUserWall(ServletRequest request, @RequestParam("last") int lastId) {
        Pageable page = new PageRequest(0, 5);
        int uid = Integer.parseInt(request.getAttribute(RestServiceController.USERID).toString());
        if (lastId == 0) {
            lastId = Integer.MAX_VALUE;
        }
        return new ResponseEntity<>(this.merge(historyRepository.findAllUidAndHidGreaterThan(uid, lastId, page)), HttpStatus.OK);

    }

    private List<ResponseHistory> merge(List<History> list) {
        List<ResponseHistory> history = new ArrayList<>();
        for (History obj : list) {
            if (obj.getHistoryElements() != null && obj.getHistoryElements().size() > 0) {
                ResponseHistory hist = new ResponseHistory();
                hist.setId(obj.getTid());
                hist.setType(obj.getType());
                hist.setDate(getDateTime(obj.getDate()));
                hist.setHid(obj.getHid());

                switch (obj.getType()) {
                    case 0:
                        User usr = userRepository.findByUid(hist.getId());
                        hist.setUserName(usr.getName());
                        hist.setPicture(usr.getPicture());
                        hist.setContent(getUserActionType(obj.getHistoryElements()));
                        history.add(hist);
                        break;
                    case 1:
                        Offer off = offerRepository.findByOid(hist.getId());
                        if (off != null) {
                            User usro = userRepository.findByUid(off.getUid());
                            hist.setPicture(usro.getPicture());
                            hist.setUserName(usro.getName());
                            hist.setServiceName(off.getTitle());
                            hist.setContent(getOfferActionType(obj.getHistoryElements()));
                            history.add(hist);
                        }
                        break;
                    case 2:
                        Request req = requestRepository.findByRid(hist.getId());
                        if (req != null) {
                            User usrr = userRepository.findByUid(req.getUid());
                            hist.setServiceName(req.getTitle());
                            hist.setPicture(usrr.getPicture());
                            hist.setUserName(usrr.getName());
                            hist.setContent(getRequestActionType(obj.getHistoryElements()));
                            history.add(hist);
                        }
                        break;
                }
            }
        }
        return history;
    }

    private String getDateTime(Date date) {
        long diff = new Date().getTime() - date.getTime();
        if (diff < 60000) {
            return "just now";
        } else if (diff < 3600000) {
            return diff / 60000 + " minutes ago";
        } else if (diff < 86400000) {
            return diff / 3600000 + " hours ago";
        } else {
            SimpleDateFormat format = new SimpleDateFormat("MMM. dd, HH:mm");
            return format.format(date);
        }
    }

    private List<WallContent> getUserActionType(List<HistoryElements> list) {
        List<WallContent> content = new ArrayList<>();
        for (HistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case UPDATED_PICTURE:
                    wallContent.setBefore(element.getBefore());
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setBefore(element.getBefore());
                    break;
                case UPDATED_PHONE_NUMBER:
                    wallContent.setBefore(element.getBefore());
                    break;
                case UPDATED_EMAIL_ADDRESS:
                    wallContent.setBefore(element.getBefore());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }

    private List<WallContent> getOfferActionType(List<HistoryElements> list) {
        List<WallContent> content = new ArrayList<>();
        SimpleDateFormat format = new SimpleDateFormat("MMM. dd, HH:mm");
        for (HistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case NEW:
                    if(element.getBefore() != null) {
                        wallContent.setBefore(categoryRepository.findByCid(Integer.parseInt(element.getBefore())).getName());
                    }
                    break;
                case UPDATED_DESCRIPTION:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
                case UPDATED_PICTURE:
                    OfferPictures offerPictures = offerPictureRepository.findByPoid(Integer.parseInt(element.getBefore()));
                    if (offerPictures != null) {
                        wallContent.setBefore(offerPictures.getSrc());
                    }
                    break;
                case UPDATED_EXPIRATION_DATE:
                    wallContent.setBefore(format.format(new Date(element.getBefore() == null || element.getBefore().length() == 0 ? 0 : Long.parseLong(element.getBefore()))));
                    wallContent.setAfter(format.format(new Date(element.getAfter() == null || element.getAfter().length() == 0 ? 0 : Long.parseLong(element.getAfter()))));
                    break;
                case UPDATED_LOCATION:
                    wallContent.setBefore(getLocation(element.getBefore()));
                    wallContent.setAfter(getLocation(element.getAfter()));
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
                case UPDATED_CATEGORY:
                    if(element.getBefore() != null && element.getBefore().length() > 0) {
                        wallContent.setBefore(categoryRepository.findByCid(Integer.parseInt(element.getBefore())).getName());
                    }
                    if(element.getAfter() != null && element.getAfter().length() > 0) {
                        wallContent.setAfter(categoryRepository.findByCid(Integer.parseInt(element.getAfter())).getName());
                    }
                    break;
                case UPDATED_AVAILABILITY:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }

    private List<WallContent> getRequestActionType(List<HistoryElements> list) {
        List<WallContent> content = new ArrayList<>();
        SimpleDateFormat format = new SimpleDateFormat("MMM. dd, HH:mm");
        for (HistoryElements element : list) {
            int action = element.getAction();
            WallContent wallContent = new WallContent();
            wallContent.setType(action);
            switch (action) {
                case NEW:
                    if(element.getBefore() != null) {
                        wallContent.setBefore(categoryRepository.findByCid(Integer.parseInt(element.getBefore())).getName());
                    }
                    break;
                case UPDATED_DESCRIPTION:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
                case UPDATED_PICTURE:
                    RequestPictures requestPictures = requestPictureRepository.findByPrid(Integer.parseInt(element.getBefore()));
                    if (requestPictures != null) {
                        wallContent.setBefore(requestPictures.getSrc());
                    }
                    break;
                case UPDATED_EXPIRATION_DATE:
                    wallContent.setBefore(format.format(new Date(element.getBefore() == null || element.getBefore().length() == 0 ? 0 : Long.parseLong(element.getBefore()))));
                    wallContent.setAfter(format.format(new Date(element.getAfter() == null || element.getAfter().length() == 0 ? 0 : Long.parseLong(element.getAfter()))));
                    break;
                case UPDATED_LOCATION:
                    wallContent.setBefore(getLocation(element.getBefore()));
                    wallContent.setAfter(getLocation(element.getAfter()));
                    break;
                case UPDATED_CATEGORY:
                    if(element.getBefore() != null && element.getBefore().length() > 0) {
                        wallContent.setBefore(categoryRepository.findByCid(Integer.parseInt(element.getBefore())).getName());
                    }
                    if(element.getAfter() != null && element.getAfter().length() > 0) {
                        wallContent.setAfter(categoryRepository.findByCid(Integer.parseInt(element.getAfter())).getName());
                    }
                    break;
                case UPDATED_JOB_DATE:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
                case UPDATED_TITLE_OR_NAME:
                    wallContent.setBefore(element.getBefore());
                    wallContent.setAfter(element.getAfter());
                    break;
            }
            content.add(wallContent);
        }
        return content;
    }

    private String getLocation(String location) {
        if (location != null) {
            try {
                JSONObject obj = new JSONObject(location);
                return obj.getString("location");
            } catch (JSONException e) {
                System.err.print("JSON Parse error" + e);
            }
        }
        return null;
    }
}