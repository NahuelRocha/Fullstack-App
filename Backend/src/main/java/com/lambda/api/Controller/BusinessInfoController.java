package com.lambda.api.Controller;

import com.lambda.api.Dtos.BusinessInfoDTO;
import com.lambda.api.Dtos.BusinessInfoUpdateDTO;
import com.lambda.api.Service.BusinessInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business")
public class BusinessInfoController {

    private final BusinessInfoService service;

    public BusinessInfoController(BusinessInfoService service) {
        this.service = service;
    }

    @GetMapping("/info")
    public ResponseEntity<BusinessInfoDTO> getBusinessInfo(){

        return ResponseEntity.ok(service.getBusinessInfo());
    }

    @PutMapping("/update")
    public ResponseEntity<BusinessInfoDTO> updateBusinessInfo(@RequestBody BusinessInfoUpdateDTO request){

        return ResponseEntity.ok(service.updateBusinessInfo(request));
    }
}
