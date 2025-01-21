package com.lambda.api.Controller;

import com.lambda.api.Dtos.ImageCreateDTO;
import com.lambda.api.Dtos.ImageDTO;
import com.lambda.api.Service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/create")
    public ResponseEntity<ImageDTO> createImage(@RequestBody ImageCreateDTO request) throws Exception {

        return ResponseEntity.ok(imageService.createImage(request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id){
        imageService.deleteImage(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<ImageDTO>> getAllImages(){

        return ResponseEntity.ok(imageService.getAllImages());
    }

}
