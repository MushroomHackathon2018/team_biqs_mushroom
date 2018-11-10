package com.qianguatech.base;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by liangdi on 11/16/16.
 */
public class Result {
    public static final String FIELD_SUCCESS = "success";
    public static final String FIELD_CODE = "code";
    public static final String FIELD_MESSAGE = "message";
    public static final String FIELD_VALUE = "value";
    public static final String FIELD_LIST = "list";
    public static final String FIELD_PAGE = "page";
    public static final String FIELD_PAGE_SIZE = "pageSize";
    public static final String FIELD_METADATA = "metadata";
    /**
     * 分页总数
     */
    public static final String FIELD_TOTAL_PAGES = "totalPages";
    /**
     * 查询总数
     */
    public static final String FIELD_TOTAL = "total";

    public Result(boolean success) {
        result.put(FIELD_SUCCESS,success);
    }

    Map<String,Object> result = new HashMap<>();

    public static Result success() {

        return new Result(true);
    }
    public static Result success(Object obj) {
        Result ret = new Result(true);
        if (obj instanceof List) {
            ret.list((List) obj);
        }
        else {
            ret.value(obj);
        }
        return ret;
    }

    public static Result failure() {
        Result ret = new Result(false);
        return ret;
    }
    public static Result failure(String message) {
        Result ret = new Result(false);
        ret.message(message);
        return ret;
    }

    public static Result failure(String message, int code) {
        Result ret = new Result(false);
        ret.message(message);
        ret.code(code);
        return ret;
    }


    public Result value(Object object) {
        result.put(FIELD_VALUE,object);
        return this;
    }
    public Result list(List list){

        result.put(FIELD_LIST,list);
        return this;
    }
    public Result message(String message) {
        result.put(FIELD_MESSAGE,message);
        return this;
    }
    public Result code(int code) {
        result.put(FIELD_CODE,code);
        return this;
    }

    /**
     * 最终返回 result map对象
     * @return
     */
    public Object build(){
        return result;
    }

    @Override
    public String toString() {
        return result.toString();
    }
}
