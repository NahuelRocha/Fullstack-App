package com.lambda.api.Dtos;

import java.util.List;

public record CreateMenuItemDTO(String title, String subtitle, String description,
                                int price, List<String> contentItems, List<String> imageUrls, Long newCategoryId) {
}
