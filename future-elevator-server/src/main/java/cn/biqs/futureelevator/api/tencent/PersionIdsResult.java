package cn.biqs.futureelevator.api.tencent;

import lombok.Data;

import java.util.List;

/**
 * 腾讯人间检测结果
 * @author liangdi
 */
@Data
public class PersionIdsResult {
    public String msg;
    public int ret;
    public ResultData data;

    @Data
    public static class ResultData {
        public List<String> person_ids;
    }

}
