package com.lambda.api.Dtos;

import java.util.List;

public record MenuItemDTO(Long id, String title, String subtitle, String description,
                          int price, List<String> contentItems, List<String> imageUrls, String category, Long category_id) {
}
