package cn.biqs.futureelevator.service;

import cn.biqs.futureelevator.Constants;
import cn.biqs.futureelevator.api.tencent.PersionIdsResult;
import cn.biqs.futureelevator.api.tencent.TecentFaceApi;
import cn.biqs.futureelevator.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/**
 * @author liangdi
 */
@Service
@Slf4j
public class UserService {

    @Autowired
    TecentFaceApi faceApi;


    List<User> users = new ArrayList<>();


    @PostConstruct
    public void init() {
        User user = new User();
        user.setPersonId("user-ld");
        user.setName("Liangdi");

        users.add(user);


        user = new User();
        user.setPersonId("user-zy");
        user.setName("章鱼");

        users.add(user);
    }


    public List<User> findAll() {
        return users;
    }

    public User findByName(String name) {
        User student = null;
        for (int i = 0; i < users.size(); i++) {
            if(users.get(i).getName().equals(name)) {
                return users.get(i);
            }
        }

        return student;
    }

    public User findByPersonId(String personId) {
        User student = null;

        for (int i = 0; i < users.size(); i++) {
            if(users.get(i).getPersonId().equals(personId)) {
                return users.get(i);
            }
        }
        return student;
    }



    /**
     * 获得已经有人脸数据的用户列表
     * @return
     */
    public List<User> findAllHaveFaceIds(){
        List<User> ret = new ArrayList<>();

        PersionIdsResult personIds = faceApi.getPersonIds(Constants.FACE_GROUP);
        if(personIds != null) {
            List<String> person_ids = personIds.getData().getPerson_ids();
            for (int i = 0; i < person_ids.size(); i++) {
                String id =  person_ids.get(i);
                User student = findByPersonId(id);
                if(student!=null) {
                    ret.add(student);
                }
            }
        }

        return ret;
    }

    public static void main(String[] args) {
        UserService service = new UserService();
        //service.init();

        String id = "student-hhxx20170226";

        User student = service.findByPersonId(id);

        log.info("student:{}",student);

        String name = "吴品汎";

        student = service.findByName(name);
        log.info("student:{}",student);

    }
}
