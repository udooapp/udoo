package com.udoo.restservice.spring;


import com.udoo.dal.entities.bookmkark.Bookmark;
import com.udoo.dal.entities.bookmkark.BookmarkRequest;
import com.udoo.dal.entities.bookmkark.BookmarkResponse;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.IBookmarkRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.dal.repositories.offer.IOfferRepository;
import com.udoo.dal.repositories.request.IRequestRepository;
import com.udoo.restservice.IBookmarkServiceController;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;

import java.util.ArrayList;
import java.util.List;

import static com.udoo.restservice.security.AuthenticationFilter.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/bookmark")
public class BookmarkServiceController implements IBookmarkServiceController {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private IBookmarkRepository bookmarkRepository;

    @Override
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public ResponseEntity<?> save(ServletRequest request, @RequestBody BookmarkRequest bookmarkRequest) {
        int uid = Integer.parseInt(request.getAttribute(USERID).toString());
        Bookmark bookmark = bookmarkRepository.findByUidAndSidAndType(uid, bookmarkRequest.getSid(), bookmarkRequest.isType());
        if (bookmark == null) {
            bookmark = new Bookmark();
            bookmark.setUid(uid);
            bookmark.setSid(bookmarkRequest.getSid());
            bookmark.setType(bookmarkRequest.isType());
            bookmarkRepository.save(bookmark);
            return new ResponseEntity<>("Bookmark added", HttpStatus.OK);
        } else {
            this.bookmarkRepository.deleteByUidAndSidAndType(bookmark.getUid(), bookmark.getSid(), bookmark.isType());
            return new ResponseEntity<>("Removed", HttpStatus.OK);
        }
    }

    @Override
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public ResponseEntity<?> removeBookmark(ServletRequest request, @RequestBody BookmarkRequest bookmarkRequest) {
        int uid = Integer.parseInt(request.getAttribute(USERID).toString());
        if (bookmarkRepository.findByUidAndSidAndType(uid, bookmarkRequest.getSid(), bookmarkRequest.isType()) != null) {
            bookmarkRepository.deleteByUidAndSidAndType(uid, bookmarkRequest.getSid(), bookmarkRequest.isType());
            return new ResponseEntity<>("Bookmark deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not found bookmark", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    @Override
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserBookmark(ServletRequest request, @RequestParam("count") int count) {
        int uid = Integer.parseInt(request.getAttribute(USERID).toString());
        if (count == 0 || count == WallServiceController.PAGE_SIZE) {
            List<Bookmark> bookmarks = bookmarkRepository.findAllByUid(uid, new PageRequest(count / WallServiceController.PAGE_SIZE, WallServiceController.PAGE_SIZE));
            List<BookmarkResponse> bookmarkResponses = new ArrayList<>();
            for (Bookmark bookmark : bookmarks) {
                BookmarkResponse bookmarkResponse = new BookmarkResponse();
                bookmarkResponse.setSid(bookmark.getSid());
                bookmarkResponse.setType(bookmark.isType());
                User user = null;
                if (bookmark.isType()) {
                    Offer offer = offerRepository.findByOid(bookmark.getSid());
                    if(offer != null) {
                        bookmarkResponse.setTitle(offer.getTitle());
                        bookmarkResponse.setLocation(getLocation(offer.getLocation()));
                        user = userRepository.findByUid(offer.getUid());
                    }
                } else {
                    Request req = requestRepository.findByRid(bookmark.getSid());
                    if(req != null) {
                        bookmarkResponse.setTitle(req.getTitle());
                        bookmarkResponse.setLocation(getLocation(req.getLocation()));
                        user = userRepository.findByUid(req.getUid());
                    }
                }
                if (user != null) {
                    bookmarkResponse.setName(user.getName());
                    bookmarkResponse.setUid(user.getUid());
                    bookmarkResponse.setPicture(user.getPicture());
                    bookmarkResponses.add(bookmarkResponse);
                }
            }
            return new ResponseEntity<>(bookmarkResponses, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    private String getLocation(String location){
        String address = "";
        if(location != null && location.length() > 0) {
            try {
                JSONObject object = new JSONObject(location);
                address = object.getString("address");
            } catch (JSONException e) {
                System.err.println(e.toString());
            }
        }
        return address;
    }
}