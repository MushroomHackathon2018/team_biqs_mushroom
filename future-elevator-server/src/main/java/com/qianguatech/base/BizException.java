package com.qianguatech.base;

import lombok.Data;

/**
 * Created by liangdi on 12/1/16.
 */
@Data
public class BizException extends Exception{
    int code = 0;
    public BizException(String message) {
        super(message);
    }
    public BizException(String message,int code){
        super(message);
        this.code = code;
    }
}
