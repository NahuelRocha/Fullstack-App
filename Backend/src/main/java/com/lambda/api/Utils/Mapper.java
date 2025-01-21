package com.lambda.api.Utils;

import com.lambda.api.Dtos.*;
import com.lambda.api.Entities.*;

import java.util.List;

public class Mapper {

    public static ImageDTO imageToDto(Image image){

        return new ImageDTO(image.getId() ,image.getPublicUrl());
    }
    public static BusinessInfoDTO businessInfoToDto(BusinessInfo businessInfo){
        return new BusinessInfoDTO(
                businessInfo.getWelcome(),
                businessInfo.getAbout(),
                businessInfo.getAddress(),
                businessInfo.getPhone(),
                businessInfo.getEmail(),
                businessInfo.getFacebook(),
                businessInfo.getInstagram(),
                businessInfo.getBusinessDays(),
                businessInfo.getBusinessHours(),
                businessInfo.getDeliveryHours()
        );
    }

    public static BannerDTO bannerToDto(Banner banner) {

        if (banner.getImageUrls().isEmpty()){
            return new BannerDTO(banner.getTittle(), banner.getDescription(), List.of("empty"));
        }

        return new BannerDTO(banner.getTittle(), banner.getDescription(), banner.getImageUrls());
    }

    public static CategoryDTO categoryToDto(Category category){

        return new CategoryDTO(category.getId(), category.getName());
    }

    public static MenuItemDTO menuToMenuItemDto (MenuItem menuItem){

        return new MenuItemDTO(
                menuItem.getId(), menuItem.getTitle(), menuItem.getSubtitle(),
                menuItem.getDescription(), menuItem.getPrice(),
                menuItem.getContentItems(), menuItem.getImageUrls(),
                menuItem.getCategory().getName()
        );
    }

    public static ProductDTO productToDto(Product product){

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getUnitOfMeasure().name(),
                product.getQuantity(),
                product.getPurchaseCost(),
                product.getCost(),
                product.getProfitMargin(),
                product.getPrice(),
                product.getMinimumOrder(),
                product.getAvailable()
        );
    }

    public static AboutDTO aboutToAboutDto(About about){

        return new AboutDTO(about.getId(), about.getTitle(), about.getAbout());
    }
}
