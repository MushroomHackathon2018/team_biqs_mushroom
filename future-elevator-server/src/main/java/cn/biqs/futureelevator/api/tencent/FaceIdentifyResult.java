package cn.biqs.futureelevator.api.tencent;

import lombok.Data;

import java.util.List;

/**
 * 腾讯人间检测结果
 * @author liangdi
 */
@Data
public class FaceIdentifyResult {
    public String msg;
    public int ret;
    public ResultData data;

    @Data
    public static class ResultData {
        public int group_size;
        public int time_ms;
        public List<Candidate> candidates;
    }

    @Data
    public static class Candidate {
        public String person_id;
        public String face_id;
        public String tag;
        public int confidence;
    }
}
