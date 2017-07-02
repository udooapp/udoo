package com.udoo.restservice;

import com.udoo.dal.entities.Comment;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface ICommentServiceController {

    ResponseEntity<?> saveComment(ServletRequest req, Comment comment);

    ResponseEntity<?>  getServiceComment(int oid, int pos, boolean type);
}
