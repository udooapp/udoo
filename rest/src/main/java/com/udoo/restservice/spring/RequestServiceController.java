package com.udoo.restservice.spring;


import com.udoo.dal.entities.DeleteService;
import com.udoo.dal.entities.request.PicturesRequest;
import com.udoo.dal.entities.request.Request;
import com.udoo.dal.entities.User;
import com.udoo.dal.entities.request.RequestPictures;
import com.udoo.dal.entities.request.RequestSave;
import com.udoo.dal.repositories.IRequestPictureRepository;
import com.udoo.dal.repositories.IRequestRepository;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.restservice.IRequestServiceController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import java.util.ArrayList;
import java.util.List;

import static com.udoo.restservice.spring.RestServiceController.USERID;


/**
 */
@Controller
@CrossOrigin
@RequestMapping("/request")
public class RequestServiceController implements IRequestServiceController {

    @Resource
    private IRequestRepository requestRepository;
    @Resource
    private IUserRepository userRepository;

    @Resource
    private IRequestPictureRepository requestPictureRepository;


    @Override
    @RequestMapping(value = "/user/upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadImage(ServletRequest req, PicturesRequest image) {
        if(image != null){
            RequestPictures pic = requestPictureRepository.save(new RequestPictures(image.getSrc(), image.getPrid()));
            if (pic!= null) {
                return new ResponseEntity<>(pic.getPrid(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Something wrong! Try again", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
    }
    @Override
    @RequestMapping(value = "/user/save", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveRequest(ServletRequest req, @RequestBody RequestSave save) {
        if (save != null) {
            User user = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
            if (user != null && save.getRequest().getUid() == user.getUid()) {
                Request request = save.getRequest();
                int delete = save.getDelete();
                if(delete <= -1){
                    requestRepository.save(request);
                    List<RequestPictures> pictures = requestPictureRepository.findAllByRid(request.getRid());
                    List<PicturesRequest> currentPictures = new ArrayList<>(request.getPicturesRequest());
                    for(RequestPictures pic :pictures){
                        int i = 0;
                        while(i < currentPictures.size() && currentPictures.get(i).getPrid() != pic.getPrid()){
                            ++i;
                        }
                        if(i>=currentPictures.size()){
                            requestPictureRepository.deleteByPrid(pic.getPrid());
                        }
                    }
                    return new ResponseEntity<>("Saved", HttpStatus.OK);
                } else {
                    int d = request.getRid();
                    request.setRid(delete);
                    request.setUid(user.getUid());
                    Request request2 = requestRepository.findByRid(d);
                    requestRepository.save(request);
                    List<RequestPictures> pictures = requestPictureRepository.findAllByRid(request.getRid());
                    List<PicturesRequest> currentPictures = new ArrayList<>(request.getPicturesRequest());
                    for(RequestPictures pic :pictures){
                        int i = 0;
                        while(i < currentPictures.size() && currentPictures.get(i).getPrid() != pic.getPrid()){
                            ++i;
                        }
                        if(i>=currentPictures.size()){
                            requestPictureRepository.deleteByPrid(pic.getPrid());
                        }else {
                            currentPictures.remove(i);
                        }
                    }

                    for(PicturesRequest pic : currentPictures){
                        RequestPictures pic2 = new RequestPictures(pic.getSrc(), request.getRid());
                        pic2.setPrid(pic.getPrid());
                        requestPictureRepository.save(pic2);
                    }

                    if (request2 != null & request2.getUid() == user.getUid()) {
                        requestRepository.deleteByRid(d);
                        return new ResponseEntity<>("Saved", HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>("It's not your service", HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    @RequestMapping(value = "/user/delete", method = RequestMethod.POST)
    public ResponseEntity<String> deleteUserRequest(ServletRequest req, @RequestBody DeleteService service) {
        int id = service.getId();
        int delete = service.getDelete();
        int uid = Integer.parseInt(req.getAttribute(USERID).toString());
        if (id > 0) {
            if (delete > 0) {
                if (requestRepository.findByRid(delete).getUid() == uid) {
                    requestRepository.deleteByRid(delete);
                    requestPictureRepository.deleteAllByRid(delete);
                }
            }
            if (requestRepository.findByRid(id).getUid() == uid) {
                int success = requestRepository.deleteByRid(id);
                requestPictureRepository.deleteAllByRid(id);
                if (success > -1) {
                    return new ResponseEntity<>("Request deleted", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("Invalid parameter", HttpStatus.BAD_REQUEST);
    }

    @Override
    @RequestMapping(value = "/user/create", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createRequest(ServletRequest req, @RequestBody String image) {
        if (image!= null) {
            User user = userRepository.findByUid(Integer.parseInt(req.getAttribute(USERID).toString()));
            if (user != null) {
                Request request = new Request();
                request.setUid(user.getUid());
                request = requestRepository.save(request);
                RequestPictures pic = requestPictureRepository.save(new RequestPictures(image, request.getRid()));
                if (pic != null) {
                    return new ResponseEntity<>(new DeleteService(pic.getPrid(), request.getRid()), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Something wrong! Try again", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                return new ResponseEntity<>("Email not found", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<List<Request>> getAllUserRequest(ServletRequest request) {
        User user = userRepository.findByUid(Integer.parseInt(request.getAttribute(USERID).toString()));
        if (user != null) {
            return new ResponseEntity<>(requestRepository.findByUid(user.getUid()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Request> getRequest(@PathVariable("id") int uid) {

        return new ResponseEntity<>(requestRepository.findByRid(uid), HttpStatus.OK);
    }

}