package com.lambda.api.Controller;

import com.lambda.api.Dtos.AboutDTO;
import com.lambda.api.Dtos.AboutRequestDTO;
import com.lambda.api.Dtos.BannerDTO;
import com.lambda.api.Service.AboutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/about")
public class AboutController {

    private final AboutService aboutService;

    public AboutController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    @GetMapping
    public ResponseEntity<AboutDTO> getAboutText(){

        return ResponseEntity.ok(aboutService.getAbout());
    }

    @PutMapping("/update")
    public ResponseEntity<AboutDTO> updateAbout(@RequestBody AboutRequestDTO aboutText){

        return ResponseEntity.ok(aboutService.updateAbout(aboutText));
    }
}
