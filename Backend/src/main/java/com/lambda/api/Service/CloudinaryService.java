package com.lambda.api.Service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


public interface CloudinaryService {

    Map<String, Object> upload(MultipartFile file);

    void delete(String public_id);
}
