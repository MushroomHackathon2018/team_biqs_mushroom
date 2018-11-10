package cn.biqs.futureelevator.web;

import cn.biqs.futureelevator.Constants;
import cn.biqs.futureelevator.api.tencent.FaceIdentifyResult;
import cn.biqs.futureelevator.api.tencent.TecentFaceApi;
import com.qianguatech.base.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


/**
 * @author liangdi
 */
@RestController
@RequestMapping("/api/face")
@Slf4j
public class FaceController {


    @Autowired
    TecentFaceApi faceApi;

    @PostMapping("detect")
    public Object detect(@RequestParam("file") MultipartFile file) throws IOException {

        File temp = File.createTempFile("cv-",".jpg");

        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream(temp));
        String fileDist = temp.getAbsolutePath();
        log.info("file:{}",fileDist);

        FaceIdentifyResult identify = faceApi.identify(fileDist, Constants.FACE_GROUP, 3);
        if(identify != null) {
            if(identify != null && identify.getData().getCandidates().size() >0) {
                log.info("识别结果:{}",identify.data.candidates.get(0).confidence);
                log.info("识别结果:{}",identify.data.candidates.get(0).person_id);
            }
            return Result.success(identify.getData().candidates).build();
        } else {
            return Result.failure().build();
        }
    }

    @PostMapping("train_assets")
    public Object trainAssets(@RequestParam("file") MultipartFile file, @RequestParam("label") String label) throws IOException {

        String trainBase = "/home/liangdi/Workspace/opencv/training-data/";

        long now = System.currentTimeMillis();



        File target = new File(trainBase + label + "/" + now + ".png");

        FileCopyUtils.copy(file.getInputStream(),new FileOutputStream(target));

        return Result.success().build();
    }

//    @GetMapping("train")
//    public Object train() {
//        String trainBase = "/home/liangdi/Workspace/opencv/training-data/";
//
//        faceDetect.train(new File(trainBase));
//        return Result.success().build();
//    }
}
