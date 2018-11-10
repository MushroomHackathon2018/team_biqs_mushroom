package com.qianguatech.base;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Created by liangdi on 12/1/16.
 */
@RestControllerAdvice
@Slf4j
public class GlobalDefaultExceptionHandler {

    @ExceptionHandler({BizException.class})
    public Object bizExceptionHandler(BizException exp) {
        log.info("bizExceptionHandler:{}",exp);
        return Result.failure(exp.getMessage(),exp.getCode()).build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException exp) {
        String defaultMessage = exp.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return Result.failure(defaultMessage).build();
    }

    @ExceptionHandler({Exception.class})
    public Object defaultExceptionHandler(Exception exp) {
        log.info("default ExceptionHandler:{}",exp);
        return Result.failure(exp.getMessage()).build();
    }
}
