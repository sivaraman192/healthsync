package com.healthsync.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        logger.error("RuntimeException encountered: ", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation Failed");

        Map<String, String> errMap = new HashMap<>();
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("email")) {
            errMap.put("field", "email");
            errMap.put("message", ex.getMessage());
        } else {
            errMap.put("field", "global");
            errMap.put("message", ex.getMessage());
        }

        body.put("errors", Collections.singletonList(errMap));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        logger.warn("MethodArgumentNotValidException encountered (validation failed): {}", ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation Failed");

        List<Map<String, String>> errorsList = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> {
                    Map<String, String> errMap = new HashMap<>();
                    errMap.put("field", fieldError.getField());
                    errMap.put("message", fieldError.getDefaultMessage());
                    return errMap;
                })
                .collect(Collectors.toList());

        body.put("errors", errorsList);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        logger.error("AccessDeniedException encountered: ", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Access denied: " + ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        logger.error("NoHandlerFoundException encountered: ", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Resource not found: " + ex.getRequestURL());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        logger.error("Unhandled exception encountered: ", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("message", "An unexpected error occurred: " + ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
