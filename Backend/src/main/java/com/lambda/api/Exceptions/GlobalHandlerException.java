package com.lambda.api.Exceptions;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalHandlerException {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> entityNotFoundHandler(EntityNotFoundException ex) {
        Map<String, String> resp = new HashMap<>();
        resp.put("ENTITY_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(resp, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ImageException.class)
    public ResponseEntity<Map<String,String>> imageExceptionHandler(ImageException ex){
        Map<String,String> resp = new HashMap<>();

        resp.put("IMAGE_ERROR", ex.getMessage());

        return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Maximum upload size exceeded");
    }

    @ExceptionHandler(EntityException.class)
    public ResponseEntity<Map<String,String>> entityExceptionHandler(EntityException ex){
        Map<String,String> resp = new HashMap<>();

        resp.put("ENTITY_ERROR", ex.getMessage());

        return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("ERROR", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidUnitOfMeasureException.class)
    public ResponseEntity<Map<String, String>> handleInvalidUnitOfMeasureException(InvalidUnitOfMeasureException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("UNIT_OF_MEASURE_ERROR", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


}
