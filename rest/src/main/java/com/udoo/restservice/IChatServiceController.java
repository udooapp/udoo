package com.udoo.restservice;


import com.udoo.dal.entities.message.MessageRequest;
import org.springframework.http.ResponseEntity;

import javax.servlet.ServletRequest;

/**
 */
public interface IChatServiceController {

    ResponseEntity<?> setChecked(ServletRequest request, int uid);

    ResponseEntity<?> sendMessage(ServletRequest request, MessageRequest messageRequest);

    ResponseEntity<?> getWallMessages(ServletRequest request, int count);

    ResponseEntity<?> geConversation(ServletRequest request, int uid);

    ResponseEntity<?> geConversation(ServletRequest request, int uid, int count);

}
