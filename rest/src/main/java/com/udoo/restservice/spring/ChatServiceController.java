package com.udoo.restservice.spring;


import com.udoo.dal.entities.message.*;
import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.*;
import com.udoo.dal.repositories.message.IConversationRepository;
import com.udoo.dal.repositories.message.IMessageRepository;
import com.udoo.dal.repositories.message.IUserConversationRepository;
import com.udoo.restservice.IChatServiceController;
import org.springframework.data.domain.PageRequest;
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
@RequestMapping("/message")
public class ChatServiceController implements IChatServiceController {

    @Resource
    private IUserConversationRepository userConversationRepository;

    @Resource
    private IConversationRepository conversationRepository;

    @Resource
    private IMessageRepository messageRepository;

    @Resource
    private IUserRepository userRepository;

    @Override
    @RequestMapping(value = "/checked", method = RequestMethod.POST)
    public ResponseEntity<?> setChecked(ServletRequest request, @RequestBody int uid) {
        int userId = Integer.parseInt(request.getAttribute(USERID).toString());
        UserConversation userConversation = userConversationRepository.getByUidAndFromId(userId, uid);
        if (userConversation != null && userConversation.getUid() == userId) {
            userConversation.setChecked(false);
            userConversationRepository.save(userConversation);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override
    @RequestMapping(value = "/send", method = RequestMethod.POST)
    public ResponseEntity<?> sendMessage(ServletRequest request,@RequestBody MessageRequest messageRequest) {
        int userId = Integer.parseInt(request.getAttribute(USERID).toString());
        User user = userRepository.findByUid(messageRequest.getUid());
        if (user != null && messageRequest.getMessage() != null && !messageRequest.getMessage().isEmpty()) {
            UserConversation userConversation = userConversationRepository.getByUidAndFromId(userId, messageRequest.getUid());
            Date date = new Date();
            if (userConversation == null) {

                Conversation conversation = new Conversation();
                conversation.setLastMessage(messageRequest.getMessage());
                conversation.setLastDate(date);
                conversation = conversationRepository.save(conversation);

                userConversation = new UserConversation();
                userConversation.setCid(conversation.getCid());
                userConversation.setUid(userId);
                userConversation.setFromId(messageRequest.getUid());
                userConversation.setChecked(true);

                UserConversation userConversation2 = new UserConversation();
                userConversation2.setCid(conversation.getCid());
                userConversation2.setFromId(userId);
                userConversation2.setUid(messageRequest.getUid());
                userConversation2.setChecked(false);

                userConversationRepository.save(userConversation2);
                userConversation = userConversationRepository.save(userConversation);

            } else {
                Conversation conversation = conversationRepository.findByCid(userConversation.getCid());
                conversation.setLastMessage(messageRequest.getMessage());
                conversation.setLastDate(date);
                conversationRepository.save(conversation);
                UserConversation userConversation2 = userConversationRepository.getByUidAndFromId(userId, messageRequest.getUid());
                userConversation2.setChecked(true);
                userConversationRepository.save(userConversation2);
            }
            Message userMessage = new Message();
            userMessage.setDate(date);
            userMessage.setMessage(messageRequest.getMessage());
            userMessage.setUcid(userConversation.getUcid());
            userMessage = messageRepository.save(userMessage);
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setSender(true);
            messageResponse.setMessage(userMessage.getMessage());
            messageResponse.setDate(WallServiceController.getDateTime(userMessage.getDate()));
            return new ResponseEntity<>(messageResponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override
    @RequestMapping(value = "/conversations", method = RequestMethod.GET)
    public ResponseEntity<?> getWallMessages(ServletRequest request, @RequestParam("count") int count) {
        int userId = Integer.parseInt(request.getAttribute(USERID).toString());
        List<ConversationResponse> conversations = new ArrayList<>();
        if (count % 10 == 0) {
            List<UserConversation> userConversations = userConversationRepository.findByFromId(userId, new PageRequest(count / 10, 10));
            for (UserConversation userConversation : userConversations) {
                ConversationResponse conversationResponse = new ConversationResponse();
                conversationResponse.setNewMessage(userConversation.isChecked());
                int uid = userConversation.getUid();
                conversationResponse.setUid(uid);
                conversationResponse.setUcid(userConversation.getUcid());
                User user = userRepository.findByUid(uid);
                Conversation conversation = conversationRepository.findByCid(userConversation.getCid());
                if (user != null && conversation != null) {
                    conversationResponse.setPicture(user.getPicture());
                    conversationResponse.setName(user.getName());
                    conversationResponse.setMessage(conversation.getLastMessage().length() > 50 ? conversation.getLastMessage().substring(0, 47) + "..." : conversation.getLastMessage());
                    conversationResponse.setDate(WallServiceController.getDateTime(conversation.getLastDate()));
                    conversations.add(conversationResponse);
                }
            }
        }
        return new ResponseEntity<>(conversations, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public ResponseEntity<?> geConversation(ServletRequest request, @RequestParam("uid") int uid) {
        int userId = Integer.parseInt(request.getAttribute(USERID).toString());
        UserConversation userConversation = userConversationRepository.getByUidAndFromId(uid, userId);

        User user = userRepository.findByUid(uid);
        MessageData messageData = new MessageData();
        if(user != null){
            messageData.setPicture(user.getPicture());
        }
        if (userConversation != null) {
            if(userConversation.isChecked()){
                userConversation.setChecked(false);
                userConversationRepository.save(userConversation);
            }
            messageData.setMessages(createMessageList(messageRepository.findAllByCidOrderByDateDesc(userId, uid, new PageRequest(0, 10)), userConversation.getUcid()));
        }
        return new ResponseEntity<>(messageData, HttpStatus.OK);
    }

    @Override
    @RequestMapping(value = "/messages", method = RequestMethod.GET)
    public ResponseEntity<?> geConversation(ServletRequest request, @RequestParam("uid") int uid, @RequestParam("count") int count) {
        int userId = Integer.parseInt(request.getAttribute(USERID).toString());
        UserConversation userConversation = userConversationRepository.getByUidAndFromId(userId, uid);
        if (userConversation != null) {
            List<MessageResponse> messageResponses = new ArrayList<>();
            if (count % 10 == 0) {
                messageResponses = createMessageList(messageRepository.findAllByCidOrderByDateDesc(userId, uid, new PageRequest(count / 10, 10)), userConversation.getUcid());
            }
            return new ResponseEntity<>(messageResponses, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private List<MessageResponse> createMessageList(List<Message> messages, int ucid) {
        List<MessageResponse> messageResponses = new ArrayList<>();
        for (Message msg : messages) {
            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setDate(WallServiceController.getDateTime(msg.getDate()));
            messageResponse.setMessage(msg.getMessage());
            messageResponse.setSender(ucid != msg.getUcid());
            messageResponses.add(0, messageResponse);
        }
        return messageResponses;
    }
}