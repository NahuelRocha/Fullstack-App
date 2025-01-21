package com.lambda.api.Entities;

import com.lambda.api.Dtos.BusinessInfoUpdateDTO;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "business_info")
public class BusinessInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String welcome;
    private String about;
    private String address;
    private String phone;
    private String email;
    private String facebook;
    private String instagram;
    @Column(name = "business_days")
    private String businessDays;
    @Column(name = "business_hours")
    private String businessHours;
    @Column(name = "delivery_hours")
    private String deliveryHours;
    @Version
    private Long version;

    public BusinessInfo(){}

    private BusinessInfo(String welcome, String about, String address,
                         String phone, String email, String facebook, String instagram,
                         String businessDays, String businessHours, String deliveryHours) {
        this.welcome = welcome;
        this.about = about;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.facebook = facebook;
        this.instagram = instagram;
        this.businessDays = businessDays;
        this.businessHours = businessHours;
        this.deliveryHours = deliveryHours;
    }

    public static BusinessInfo createInfo(){

        return new BusinessInfo(
                "Welcome info",
                "About info",
                "Address info",
                "Phone info",
                "Email info",
                "Facebook url",
                "Instagram url",
                "Business days",
                "Business hours",
                "Delivery hours"
                );
    }

    public void updateInfo(BusinessInfoUpdateDTO request) {

        request.updates().forEach((field, value) -> {
            switch (field) {
                case "welcome" -> this.welcome = value;
                case "about" -> this.about = value;
                case "address" -> this.address = value;
                case "phone" -> this.phone = value;
                case "email" -> this.email = value;
                case "facebook" -> this.facebook = value;
                case "instagram" -> this.instagram = value;
                case "businessDays" -> this.businessDays = value;
                case "businessHours" -> this.businessHours = value;
                case "deliveryHours" -> this.deliveryHours = value;
                default -> throw new IllegalArgumentException("Campo inválido: " + field);
            }
        });
    }

    public Long getId() {
        return id;
    }

    public String getWelcome() {
        return welcome;
    }

    public String getAbout() {
        return about;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getFacebook() {
        return facebook;
    }

    public String getInstagram() {
        return instagram;
    }

    public String getBusinessDays() {
        return businessDays;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public String getDeliveryHours() {
        return deliveryHours;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BusinessInfo that = (BusinessInfo) o;
        return Objects.equals(id, that.id) && Objects.equals(welcome, that.welcome) && Objects.equals(about, that.about) && Objects.equals(address, that.address) && Objects.equals(phone, that.phone) && Objects.equals(email, that.email) && Objects.equals(facebook, that.facebook) && Objects.equals(instagram, that.instagram) && Objects.equals(businessDays, that.businessDays) && Objects.equals(businessHours, that.businessHours) && Objects.equals(deliveryHours, that.deliveryHours);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, welcome, about, address, phone, email, facebook, instagram, businessDays, businessHours, deliveryHours);
    }
}
