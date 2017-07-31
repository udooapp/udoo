package com.udoo.restservice;


import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;
import java.util.Date;

/**
 */
public interface IWallServiceController {

    ResponseEntity<?> getOfflineWall(int lastId);

    ResponseEntity<?> getUserWall(ServletRequest request, int lastId);

}
