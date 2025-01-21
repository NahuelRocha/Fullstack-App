package com.lambda.api.Entities;

import com.lambda.api.Dtos.CreateMenuItemDTO;
import com.lambda.api.Dtos.MenuItemUpdateDTO;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "menu_item")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private int price;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "menu_items",
            joinColumns = @JoinColumn(name = "menu_id")
    )
    @Column(name = "content_item")
    private List<String> contentItems = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "menu_images", joinColumns = @JoinColumn(name = "menu_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
    @Column(name = "max_images")
    private final Integer maxImages = 3;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    private Boolean available;
    @Version
    private Long version;

    public MenuItem (){}
    private MenuItem (String title, String subtitle, String description,
                     int price, List<String> contentItems, List<String> imageUrls, Category category){
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.price = price;
        this.contentItems = contentItems;
        this.imageUrls = imageUrls;
        this.category = category;
        this.available = true;

    }

    public static MenuItem createMenuItem(CreateMenuItemDTO request, Category category) {

        return new MenuItem(
                request.title(), request.subtitle(), request.description(), request.price(),
                request.contentItems(), request.imageUrls(), category
        );
    }

    public void updateMenuItem(MenuItemUpdateDTO updateDTO, Category newCategory){

        updateDTO.updates().forEach((field, value) -> {
            switch (field) {
                case "title" -> this.title = (String) value;
                case "subtitle" -> this.subtitle = (String) value;
                case "description" -> this.description = (String) value;
                case "price" -> this.price = (Integer) value;
                case "contentItems" -> {
                    @SuppressWarnings("unchecked")
                    List<String> items = (List<String>) value;
                    this.contentItems = new ArrayList<>(items);
                }
                case "imageUrls" -> {
                    @SuppressWarnings("unchecked")
                    List<String> newImages = (List<String>) value;
                    if (newImages.size() <= maxImages) {
                        this.imageUrls = newImages;
                    } else {
                        throw new IllegalArgumentException(
                                "Number of images exceeds the maximum allowed: " + maxImages
                        );
                    }
                }
                case "category" -> {
                    if (newCategory != null) {
                        this.category = newCategory;
                    }
                }
                case "available" -> this.available = (Boolean) value;
                default -> throw new IllegalArgumentException("Invalid field: " + field);
            }
        });
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

    public void updateContentItems(List<String> contentItems) { this.contentItems = contentItems; }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public String getDescription() {
        return description;
    }

    public int getPrice() {
        return price;
    }

    public List<String> getContentItems() {
        return Collections.unmodifiableList(contentItems);
    }

    public List<String> getImageUrls() {
        return Collections.unmodifiableList(imageUrls);
    }

    public Integer getMaxImages() {
        return maxImages;
    }

    public Category getCategory() {
        return category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MenuItem menuItem = (MenuItem) o;
        return price == menuItem.price && Objects.equals(id, menuItem.id) && Objects.equals(title, menuItem.title) && Objects.equals(subtitle, menuItem.subtitle) && Objects.equals(description, menuItem.description) && Objects.equals(contentItems, menuItem.contentItems) && Objects.equals(imageUrls, menuItem.imageUrls) && Objects.equals(maxImages, menuItem.maxImages) && category == menuItem.category && Objects.equals(version, menuItem.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, subtitle, description, price, contentItems, imageUrls, maxImages, category, version);
    }
}
