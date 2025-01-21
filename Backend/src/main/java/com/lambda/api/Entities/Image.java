package com.lambda.api.Entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cache;

import java.util.Map;


@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String hash;
    @Column(name = "public_url", nullable = false)
    private String publicUrl;
    @Column(name = "public_id",nullable = false)
    private String publicId;
    @Version
    private Long version;

    public Image(){}

    private Image(String publicUrl, String publicId, String hash){
        this.publicUrl = publicUrl;
        this.hash = hash;
        this.publicId = publicId;
    }

    public static Image createImage(Map upload, String hash){
        return new Image(
                (String) upload.get("url"),
                (String) upload.get("public_id"),
                hash
        );
    }

    public Long getId() {
        return id;
    }

    public String getHash() {
        return hash;
    }

    public String getPublicUrl() {
        return publicUrl;
    }

    public String getPublicId() {
        return publicId;
    }
}
