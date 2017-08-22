package com.udoo.restservice.spring;


import com.udoo.dal.entities.comment.Comment;
import com.udoo.dal.entities.comment.CommentResponse;
import com.udoo.dal.entities.Notification;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.repositories.*;
import com.udoo.dal.repositories.offer.IOfferRepository;
import com.udoo.dal.repositories.request.IRequestRepository;
import com.udoo.restservice.ICommentServiceController;
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
import java.util.Date;
import java.util.List;

import static com.udoo.restservice.security.AuthenticationFilter.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/comment")
public class CommentServiceController implements ICommentServiceController{

    @Resource
    private ICommentRepository commentRepository;

    @Resource
    private IUserRepository userRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IContactRepository contactRepository;

    @Resource
    private INotificationRepository notificationRepository;

    @Override
    @RequestMapping(value="/save", method = RequestMethod.POST)
    public ResponseEntity<?> saveComment(ServletRequest req,@RequestBody Comment comment) {
        int uid = Integer.parseInt(req.getAttribute(USERID).toString());
        if(comment.getComment().isEmpty()){
            return new ResponseEntity<>("The comment message is empty", HttpStatus.UNAUTHORIZED);
        }
        if(comment.isType()){
            Offer offer = offerRepository.findByOid((int)comment.getSid());
            if(offer.getUid() != comment.getUid()){
                return new ResponseEntity<>("Invalid parameters", HttpStatus.UNAUTHORIZED);
            }
        } else{
            Request request = requestRepository.findByRid((int)comment.getSid());
            if(request.getUid() != comment.getUid()){
                return new ResponseEntity<>("Invalid parameters", HttpStatus.UNAUTHORIZED);
            }
        }
        if(uid != comment.getUid() && contactRepository.getAllByUidAndCid(uid, (int)comment.getUid()) == null){
            return new ResponseEntity<>("First, add to the contacts", HttpStatus.UNAUTHORIZED);
        } else{
            comment.setComment(comment.getComment());
            comment.setUid(uid);
            comment.setDate(new Date());
            commentRepository.save(comment);
            User usr = userRepository.findByUid((int)uid);
            CommentResponse comm = new CommentResponse();
            comm.setName(usr.getName());
            comm.setPicture(usr.getPicture());
            comm.setCommentMessage(comment.getComment());
            comm.setDate(comment.getDate());
            comm.setUid((int)comment.getUid());
            int id = 0;
            if(comment.isType()){
                id = offerRepository.findByOid((int)comment.getSid()).getUid();
            } else {

                id = requestRepository.findByRid((int)comment.getSid()).getUid();
            }
            if(id != uid) {
                Notification notification = new Notification();
                notification.setId(uid);
                notification.setUid(id);
                notification.setType(comment.isType() ? 1 : 2);
                notification.setChecked(false);
                notificationRepository.save(notification);
            }
            return new ResponseEntity<>(comm, HttpStatus.OK);
        }
    }

    @Override
    @RequestMapping(value="/", method = RequestMethod.GET)
    public ResponseEntity<?> getServiceComments(@RequestParam("sid") int oid, @RequestParam("pos")int pos, @RequestParam("type") boolean type) {
        Pageable page = new PageRequest(pos / WallServiceController.PAGE_SIZE, WallServiceController.PAGE_SIZE, Sort.Direction.DESC, "creatingdate");
        List<Comment> comments = commentRepository.findAllBySidAndType(oid, type, page);
        List<CommentResponse> list = new ArrayList<>();
        if(comments != null && !comments.isEmpty()){
            User usr;
            for(Comment comment : comments){
                 usr = userRepository.findByUid((int)comment.getUid());
                 if(usr != null){
                     CommentResponse resp = new CommentResponse();
                     resp.setCommentMessage(comment.getComment());
                     resp.setPicture(usr.getPicture());
                     resp.setName(usr.getName());
                     resp.setUid((int)comment.getUid());
                     resp.setDate(comment.getDate());
                     list.add(resp);
                 } else {
                     comments.remove(comment);
                 }
            }
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}