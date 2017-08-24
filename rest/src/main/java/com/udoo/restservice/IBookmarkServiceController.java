package com.udoo.restservice;

import com.udoo.dal.entities.bookmkark.BookmarkRequest;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

public interface IBookmarkServiceController {

    ResponseEntity<?> save(ServletRequest request,BookmarkRequest bookmark);

    ResponseEntity<?> getAllUserBookmark(ServletRequest request, int count);

    ResponseEntity<?> removeBookmark(ServletRequest request, BookmarkRequest bookmarkRequest);

}
