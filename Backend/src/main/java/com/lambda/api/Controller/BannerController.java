package com.lambda.api.Controller;

import com.lambda.api.Dtos.ModifyBannerDataDTO;
import com.lambda.api.Dtos.ModifyBannerImageDTO;
import com.lambda.api.Dtos.BannerDTO;
import com.lambda.api.Service.BannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/banner")
public class BannerController {

    private final BannerService service;

    public BannerController(BannerService service) {
        this.service = service;
    }

    @PostMapping("/images")
    public ResponseEntity<BannerDTO> addBannerImage(@RequestBody ModifyBannerImageDTO request){

        return ResponseEntity.ok(service.addBannerImage(request));
    }

    @DeleteMapping("/images")
    public ResponseEntity<BannerDTO> removeBannerImage(@RequestBody ModifyBannerImageDTO request){

        return ResponseEntity.ok(service.removeBannerImage(request));
    }

    @PutMapping("/update")
    public ResponseEntity<BannerDTO> updateBannerData(@RequestBody ModifyBannerDataDTO data){

        return ResponseEntity.ok(service.updateBannerData(data));
    }

    @GetMapping
    public ResponseEntity<BannerDTO> getBannerImage(){

        return ResponseEntity.ok(service.getBannerImages());
    }
}
