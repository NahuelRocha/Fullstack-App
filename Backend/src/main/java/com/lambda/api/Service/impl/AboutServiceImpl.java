package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.AboutDTO;
import com.lambda.api.Dtos.AboutRequestDTO;
import com.lambda.api.Entities.About;
import com.lambda.api.Repositories.AboutRepository;
import com.lambda.api.Service.AboutService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AboutServiceImpl implements AboutService {


    private final AboutRepository aboutRepository;

    public AboutServiceImpl(AboutRepository repository) {
        this.aboutRepository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public AboutDTO getAbout() {

        var about = findAbout();
        return Mapper.aboutToAboutDto(about);
    }

    @Override
    @Transactional
    public AboutDTO updateAbout(AboutRequestDTO request) {

        var about = findAbout();
        about.updateAbout(request);
        aboutRepository.save(about);
        return Mapper.aboutToAboutDto(about);
    }

    @Transactional(readOnly = true)
    private About findAbout(){
        return aboutRepository.findAbout()
                .orElseThrow(()-> new EntityNotFoundException("About not found."));
    }

}
