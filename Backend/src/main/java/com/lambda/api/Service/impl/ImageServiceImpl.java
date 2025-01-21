package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.ImageCreateDTO;
import com.lambda.api.Dtos.ImageDTO;
import com.lambda.api.Entities.Image;
import com.lambda.api.Exceptions.ImageException;
import com.lambda.api.Repositories.BannerRepository;
import com.lambda.api.Repositories.ImageRepository;
import com.lambda.api.Repositories.MenuItemRepository;
import com.lambda.api.Service.CloudinaryService;
import com.lambda.api.Service.ImageService;
import com.lambda.api.Utils.Base64MultipartFile;
import com.lambda.api.Utils.ImageHashUtils;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository repository;
    private final CloudinaryService cloudinaryService;
    private final BannerRepository bannerRepository;
    private final MenuItemRepository menuItemRepository;


    public ImageServiceImpl(ImageRepository repository, CloudinaryService cloudinaryService, BannerRepository bannerRepository, MenuItemRepository menuItemRepository) {
        this.repository = repository;
        this.cloudinaryService = cloudinaryService;
        this.bannerRepository = bannerRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    @Transactional
    public ImageDTO createImage(ImageCreateDTO request) throws Exception {

        byte[] imageBytes = Base64.getDecoder().decode(request.base64image());

        MultipartFile file = new Base64MultipartFile(
                imageBytes
        );

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null");
        }

        var hashImage = ImageHashUtils.calculateHash(file);
        Optional<Image> existingImage = repository.findByHash(hashImage);

        if (existingImage.isPresent()){
            return Mapper.imageToDto(existingImage.get());
        }

        Map upload = cloudinaryService.upload(file);

        Image newImage = Image.createImage(upload, hashImage);

        repository.save(newImage);

        return Mapper.imageToDto(newImage);
    }

    @Override
    @Transactional
    public void deleteImage(Long id) {

        Image image = repository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Image not found with ID: " + id));

        String publicUrl = image.getPublicUrl();

        boolean isUsedInMenuItem = menuItemRepository.existsByImageUrl(publicUrl);
        boolean isUsedInBanner = bannerRepository.existsByImageUrl(publicUrl);

        if (isUsedInMenuItem || isUsedInBanner) {
            throw new ImageException("Image URL is associated with a MenuItem or Banner and cannot be deleted.");
        }

        cloudinaryService.delete(image.getPublicId());

        repository.delete(image);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageDTO> getAllImages() {

        var images = repository.findAll();

        return images.stream()
                .map(Mapper::imageToDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByPublicUrl(String url) {
        return repository.existsByPublicUrl(url);
    }
}
