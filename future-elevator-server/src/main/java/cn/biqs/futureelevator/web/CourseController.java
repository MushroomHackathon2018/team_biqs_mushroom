package com.qianguatech.edu.web;

import com.qianguatech.Constants;
import com.qianguatech.base.Result;
import com.qianguatech.edu.CourseSession;
import com.qianguatech.edu.StompTopic;
import com.qianguatech.edu.StudentSession;
import com.qianguatech.edu.model.Student;
import com.qianguatech.edu.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import me.liangdi.smartassistant.cv.api.TecentFaceApi;
import me.liangdi.smartassistant.cv.api.tencent.FaceIdentifyResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.qianguatech.Constants.FACE_GROUP;

/**
 * @author liangdi
 */
@RestController
@RequestMapping("/api/course")
@Slf4j
public class CourseController {
    @Autowired
    CourseSession courseSession;

    @Autowired
    StudentService studentService;

    @Autowired
    TecentFaceApi faceApi;
    @Autowired
    StudentSession studentSession;

    @Value("${user.confidence}")
    public int confidence = 90;


    @Autowired
    SimpMessagingTemplate websocket;


    @PostConstruct
    public void init() {

    }

    /**
     * 系统信息
     * @return
     */
    @GetMapping("info")
    public Object info() {

        return Result.success(courseSession).build();
    }

    /**
     * 学生列表
     * @return
     */
    @GetMapping("students")
    public Object studentList(){
        return Result.success(studentService.findAll()).build();
    }

    /**
     * 已有人脸数据的
     * @return
     */
    @GetMapping("person_ids")
    public Object personIds() {
        return Result.success(studentService.findAllHaveFaceIds()).build();
    }



    @GetMapping("user")
    public Object getUser(HttpSession session) {
        Object student = session.getAttribute(Constants.SESSION_STUDENT);

        if(student != null) {
            return Result.success(student).build();
        } else {
            return Result.failure().build();
        }
    }

    /**
     * 普通登录
     * @param name
     * @param pass
     * @param session
     * @return
     */
    @GetMapping("login")
    public Object login(@RequestParam String name, @RequestParam String pass, HttpSession session) {

        if(studentService.findByName(name)!= null || !pass.equals("123")) {
            return Result.failure("登录失败").build();
        }

        if (!courseSession.students.contains(name)) {
            courseSession.students.add(name);
        }

        return Result.success(name).build();
    }

    @GetMapping("logout")
    public Object logout(HttpSession session) {
       Student me = (Student) session.getAttribute(Constants.SESSION_STUDENT);
       if(me != null) {
           courseSession.students.remove(me.getPersonId());

       }
       session.removeAttribute(Constants.SESSION_STUDENT);
        return Result.success().build();
    }

    /**
     * 人脸登录
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("login_by_face")
    public Object loginByFace(@RequestParam("file") MultipartFile file,HttpSession session) throws IOException {

        File temp = File.createTempFile("cv-",".jpg");

        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream(temp));
        String fileDist = temp.getAbsolutePath();
        log.info("file:{}",fileDist);

        FaceIdentifyResult identify = faceApi.identify(fileDist, FACE_GROUP, 3);
        if(identify != null) {
            if(identify != null && identify.getData().getCandidates().size() >0) {
                if(identify.data.candidates.get(0).confidence > confidence) {
                    String personId = identify.data.candidates.get(0).person_id;
                    Student student = studentService.findByPersonId(personId);
                    if(student != null) {
                        studentService.online(personId);
                        session.setAttribute(Constants.SESSION_STUDENT,student);
                        return Result.success(student).build();
                    }
                } else {
                    log.info("识别结果小于阈值:{},{}",identify.data.candidates.get(0).confidence,identify.data.candidates.get(0).person_id);

                }
            }

        }
        return Result.failure().build();

    }

    /**
     * 训练数据
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("train_face")
    public Object trainFace(@RequestParam("file") MultipartFile file, @RequestParam String personId,@RequestParam String name) throws IOException {

        File temp = File.createTempFile("cv-",".jpg");
        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream(temp));
        String fileDist = temp.getAbsolutePath();
        log.info("file:{}",fileDist);

        if(faceApi.getPerson(personId)) {
            // 增量训练
            log.info("增量训练:{},{}",personId,name);
            String tag = String.valueOf( System.currentTimeMillis());
            List<String> faces = new ArrayList<>();
            faces.add(fileDist);
            faceApi.addFaces(faces,personId,tag);
        } else {
            // 新建用户
            log.info("新建用户:{},{}",personId,name);
            faceApi.createPerson(fileDist, Constants.FACE_GROUP,personId,name);
        }


        return Result.success().build();
    }

    /**
     * 删除人脸
     * @param personId
     * @return
     */
    @GetMapping("delete_face")
    public Object deleteFace(@RequestParam String personId) {
        faceApi.deletePerson(personId);

        return Result.success().build();
    }



    /**
     * 获取个人状态
     * @param personId
     * @return
     */
    @GetMapping("status")
    public Object status(@RequestParam String personId) {

        return Result.success(studentSession.getStringStatus().get(personId)).build();
    }

    @GetMapping("all_status")
    public Object allStatus() {
        return Result.success(studentSession.getStringStatus()).build();
    }


    @GetMapping("answer")
    public Object answer(@RequestParam String personId,@RequestParam String question, @RequestParam  String answer) {

        Map<String, String> status = studentSession.getStringStatus().get(personId);

        if(status == null) {
            status = new HashMap<>();
        }

        status.put(question,answer);

        studentSession.getStringStatus().put(personId,status);
        return Result.success().build();
    }

    /**
     * 获取问题的回答着
     * @param question
     * @return
     */
    @GetMapping("answer_students")
    public Object answerStudents(@RequestParam String question) {

        List<Map<String,Object>> ret = new ArrayList<>();
        studentSession.getStringStatus().forEach((personId,map) ->{
            if(map.get(question) != null) {
                Map<String,Object> ans = new HashMap<>();
                ans.put("personId",personId);
                ans.put("answer",map.get(question));
                ret.add(ans);
            }
        });

        return Result.success(ret).build();
    }

    /**
     * 出题
     * @param question
     * @return
     */
    @GetMapping("send_question")
    public  Object sendQuestion(@RequestParam String question) {
        websocket.convertAndSend(StompTopic.TOPIC_QUESTION,question);
        courseSession.currentQuestion = question;
        return Result.success().build();
    }

    @GetMapping("send_ppt")
    public Object sendPpt(@RequestParam String ppt) {
        websocket.convertAndSend(StompTopic.TOPIC_SCREEN,ppt);
        courseSession.currentPpt =ppt;
        return Result.success().build();
    }

    @GetMapping("send_answer")
    public Object sendAnswer(@RequestParam String question, @RequestParam(required = false,defaultValue = "") String personId) {

        if(StringUtils.isEmpty(personId)) {
            Map<String,Object> body = new HashMap<>();
            body.put("student",null);
            body.put("answer",null);

            websocket.convertAndSend(StompTopic.TOPIC_ANSWER,body);

            return Result.success().build();
        }

        Map<String, String> answers = studentSession.getStringStatus().get(personId);
        String answerJson = answers.get(question);


        if(org.apache.commons.lang3.StringUtils.isEmpty(answerJson)) {
            return Result.failure("答案不存在");
        }

        Map<String,Object> body = new HashMap<>();

        Student student = studentService.findByPersonId(personId);

        body.put("student",student);
        body.put("answer",answerJson);

        websocket.convertAndSend(StompTopic.TOPIC_ANSWER,body);

        return Result.success().build();
    }



}
