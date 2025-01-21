package com.lambda.api.Entities;

import com.lambda.api.Dtos.ModifyBannerDataDTO;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;



@Entity
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tittle;
    private String description;
    @ElementCollection
    @CollectionTable(name = "banner_images", joinColumns = @JoinColumn(name = "banner_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "max_images")
    private final Integer maxImages = 5;
    @Version
    private Long version;

    public Banner(){}

    public Banner(String tittle, String description){}

    public void updateBannerDesc(ModifyBannerDataDTO request){

        this.tittle = request.tittle();
        this.description = request.description();
    }
    public boolean canAddImage() {
        return imageUrls.size() < maxImages;
    }

    public void addImage(String url){
        this.imageUrls.add(url);
    }

    public void removeImage(String url){
        this.imageUrls.remove(url);
    }

    public Long getId() {
        return id;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public Integer getMaxImages() {
        return maxImages;
    }

    public String getTittle() {
        return tittle;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Banner banner = (Banner) o;
        return Objects.equals(id, banner.id) && Objects.equals(imageUrls, banner.imageUrls) && Objects.equals(maxImages, banner.maxImages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, imageUrls, maxImages);
    }
}
