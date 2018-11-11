package cn.biqs.futureelevator.web;

import cn.biqs.futureelevator.Constants;
import cn.biqs.futureelevator.api.tencent.FaceIdentifyResult;
import cn.biqs.futureelevator.api.tencent.TecentFaceApi;
import cn.biqs.futureelevator.service.UserService;
import com.qianguatech.base.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static cn.biqs.futureelevator.Constants.FACE_GROUP;


/**
 * @author liangdi
 */
@RestController
@RequestMapping("/api/course")
@Slf4j
public class CourseController {


    @Autowired
    TecentFaceApi faceApi;

    @Value("${user.confidence}")
    public int confidence = 90;
    @Autowired
    UserService userService;



    @PostConstruct
    public void init() {

    }


    /**
     * 学生列表
     * @return
     */
    @GetMapping("users")
    public Object userList(){
        return Result.success(userService.findAll()).build();
    }

    /**
     * 已有人脸数据的
     * @return
     */
    @GetMapping("person_ids")
    public Object personIds() {
        return Result.success(userService.findAllHaveFaceIds()).build();
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
     * 人脸登录
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("login_by_face")
    public Object loginByFace(@RequestParam("file") MultipartFile file, HttpSession session) throws IOException {

        File temp = File.createTempFile("cv-",".jpg");

        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream(temp));
        String fileDist = temp.getAbsolutePath();
        log.info("file:{}",fileDist);

        FaceIdentifyResult identify = faceApi.identify(fileDist, FACE_GROUP, 3);
        if(identify != null) {
            if(identify != null && identify.getData().getCandidates().size() >0) {
                if(identify.data.candidates.get(0).confidence > confidence) {
                    String personId = identify.data.candidates.get(0).person_id;
                    return Result.success(personId).build();
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
    public Object trainFace(@RequestParam("file") MultipartFile file, @RequestParam String personId, @RequestParam String name) throws IOException {

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






}
