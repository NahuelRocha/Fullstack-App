package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.ModifyBannerDataDTO;
import com.lambda.api.Dtos.ModifyBannerImageDTO;
import com.lambda.api.Dtos.BannerDTO;
import com.lambda.api.Entities.Banner;
import com.lambda.api.Exceptions.ImageException;
import com.lambda.api.Repositories.BannerRepository;
import com.lambda.api.Service.BannerService;
import com.lambda.api.Service.ImageService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BannerServiceImpl implements BannerService {
    private final BannerRepository bannerRepository;
    private final ImageService imageService;

    public BannerServiceImpl(BannerRepository bannerRepository, ImageService imageService) {
        this.bannerRepository = bannerRepository;
        this.imageService = imageService;
    }

    @Override
    @Transactional(readOnly = true)
    public BannerDTO getBannerImages() {

        var banner = findBanner();
        return Mapper.bannerToDto(banner);
    }

    @Override
    @Transactional
    public BannerDTO updateBannerData(ModifyBannerDataDTO request) {

        var banner = findBanner();

        banner.updateBannerDesc(request);

        bannerRepository.save(banner);

        return Mapper.bannerToDto(banner);
    }

    @Override
    @Transactional
    public BannerDTO addBannerImage(ModifyBannerImageDTO request){

        var banner = findBanner();

        if(!banner.canAddImage()){
            throw new IllegalStateException("Banner has reached maximum number of images");
        }

        if(!imageService.existsByPublicUrl(request.url())){
            throw new ImageException("Image url not found in the database");
        }
        banner.addImage(request.url());
        bannerRepository.save(banner);

        return Mapper.bannerToDto(banner);
    }

    @Override
    @Transactional
    public BannerDTO removeBannerImage(ModifyBannerImageDTO url) {

        var banner = findBanner();

        if (!banner.getImageUrls().contains(url.url())){
            throw new IllegalStateException("The URL provided is not part of the banner");
        }

        banner.removeImage(url.url());
        bannerRepository.save(banner);

        return Mapper.bannerToDto(banner);
    }

    private Banner findBanner(){

        return bannerRepository.findBanner()
                .orElseThrow(()-> new EntityNotFoundException("Banner not found"));
    }

}
