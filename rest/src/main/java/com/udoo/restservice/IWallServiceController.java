package com.udoo.restservice;


import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.Date;

/**
 */
public interface IWallServiceController {

    ResponseEntity<?> getOfflineWall(long millis);

    ResponseEntity<?> getUserWall(ServletRequest request, long millis);

}
