package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.BusinessInfoDTO;
import com.lambda.api.Dtos.BusinessInfoUpdateDTO;
import com.lambda.api.Entities.BusinessInfo;
import com.lambda.api.Repositories.BusinessInfoRepository;
import com.lambda.api.Service.BusinessInfoService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusinessInfoServiceImpl implements BusinessInfoService {

    private final BusinessInfoRepository repository;

    public BusinessInfoServiceImpl(BusinessInfoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public BusinessInfoDTO getBusinessInfo() {

        BusinessInfo findBusiness = findBusinessInfo();
        return Mapper.businessInfoToDto(findBusiness);
    }

    @Override
    @Transactional
    public BusinessInfoDTO updateBusinessInfo(BusinessInfoUpdateDTO request) {

        var findBusiness = findBusinessInfo();
        findBusiness.updateInfo(request);
        repository.save(findBusiness);

        return Mapper.businessInfoToDto(findBusiness);
    }

    private BusinessInfo findBusinessInfo(){

        return repository.findBusinessInfo()
                .orElseThrow(()-> new EntityNotFoundException("BusinessInfo not found."));
    }
}
