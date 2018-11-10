package cn.biqs.futureelevator.api.tencent;

import cn.biqs.futureelevator.api.TencentFaceResult;
import cn.xsshome.taip.face.TAipFace;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.List;

/**
 * @author liangdi
 */
@Service
@Slf4j
public class TecentFaceApi {
    public static final String APP_ID = "1106841791";
    public static final String APP_KEY = "siwlC6m1QqXkTri9";
    Gson gson = new Gson();
    TAipFace aipFace;
    @PostConstruct
    public void init() {
         aipFace = new TAipFace(APP_ID, APP_KEY);
    }

    /**
     * 创建用户资料
     * @param group
     * @param id
     * @param name
     */
    public void createPerson(String  firstPhoto , String group, String id, String name) {
        log.info("创建人脸:{},{}",id, name);

        try {
            byte[] bytes = FileUtils.readFileToByteArray(new File(firstPhoto));
            String resultJson = aipFace.faceNewperson(bytes, group, id, name);

        } catch (Exception e) {
            log.info(e.getMessage(),e);
        }

    }

    /**
     * 删除个体人脸数据
     * @param id
     */
    public void deletePerson(String id) {

        try {
            aipFace.faceDelperson(id);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     *
     * @param faces
     * @param persionId
     * @param tag
     */
    public void addFaces(List<String> faces,String persionId,String tag) {
        try {
            log.info("faces:{}",faces);
            aipFace.faceAddfaceByFilePath(faces,persionId,tag);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 人脸验证
     * @param file
     * @param group
     */
    public FaceIdentifyResult identify(String file,String group, int maxCount) {
        FaceIdentifyResult result = null;
        try {
            String resultJson = aipFace.faceIdentify(file, group, maxCount);
            result = gson.fromJson(resultJson,FaceIdentifyResult.class);
        } catch (Exception e) {
            log.info("验证错误:{}",e.getMessage(),e);
        }

        return result;
    }

    public PersionIdsResult getPersonIds(String group) {
        PersionIdsResult result = null;
        try {
            String personIds = aipFace.getPersonIds(group);
            //log.info("personIds:{}",personIds);

            result = gson.fromJson(personIds,PersionIdsResult.class);
        } catch (Exception e) {
            log.error("错误:{}",e.getMessage(),e);
        }
        return result;
    }


    public boolean getPerson(String personId) {
        TencentFaceResult result  = null;
        try {
            String s = aipFace.faceGetInfo(personId);
            log.info("get person:{}",s);
            result = gson.fromJson(s,TencentFaceResult.class);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }

        if(result != null) {
            if(result.ret == 0) {
                return true;
            }
        }

        return false;
    }


    public static void main(String[] args) {
        String file ="/home/liangdi/Workspace/opencv/training-data/3/20.jpg";
        //String fileToId ="/home/liangdi/Workspace/opencv/training-data/3/320.jpg";
        String fileToId ="/home/liangdi/Workspace/opencv/training-data/0/30.jpg";
        String group = "hhschool";
        String id = "student-001";
        String name = "吴亮弟";

        TecentFaceApi api = new TecentFaceApi();
        api.init();

        //api.createPerson(file,group,id,name);
//
//        FaceIdentifyResult identify = api.identify(fileToId, group, 3);
//        if(identify != null && identify.getData().getCandidates().size() >0) {
//            log.info("识别结果:{}",identify.data.candidates.get(0).confidence);
//            log.info("识别结果:{}",identify.data.candidates.get(0).person_id);
//        }

        PersionIdsResult personIds = api.getPersonIds(group);
        if(personIds != null) {
            log.info("信息列表:{}",personIds.getData().getPerson_ids());

        } else {
            log.info("未得到数据");
        }

        if( api.getPerson(id)) {
            log.info("id:{}, 存在",id);
        } else {
            log.info("id:{}, 不存在",id);
        }

        if( api.getPerson(id + "_02")) {
            log.info("id:{}, 存在",id);
        } else {
            log.info("id:{}, 不存在",id + "_02");
        }


    }
}
