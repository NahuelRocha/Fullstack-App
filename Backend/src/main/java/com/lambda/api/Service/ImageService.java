package com.lambda.api.Service;

import com.lambda.api.Dtos.ImageCreateDTO;
import com.lambda.api.Dtos.ImageDTO;

import java.util.List;

public interface ImageService {

    ImageDTO createImage(ImageCreateDTO file) throws Exception;
    void deleteImage(Long id);
    List<ImageDTO> getAllImages();
    boolean existsByPublicUrl(String url);
}
