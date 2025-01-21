package com.lambda.api.Dtos;

import java.util.List;
import java.util.Map;
import java.util.Set;

public record MenuItemUpdateDTO(Long id, Map<String, Object> updates) {

    private static final Set<String> VALID_FIELDS = Set.of(
            "title", "subtitle", "description", "price",
            "contentItems", "imageUrls", "category", "available"
    );

    public MenuItemUpdateDTO {
        updates.keySet().forEach(field -> {
            if (!VALID_FIELDS.contains(field)) {
                throw new IllegalArgumentException("Invalid field: " + field);
            }
            switch (field) {
                case "price" -> {
                    if (!(updates.get(field) instanceof Integer)) {
                        throw new IllegalArgumentException("Price must be an integer");
                    }
                }
                case "category" -> {
                    if (!(updates.get(field) instanceof Integer)) {
                        throw new IllegalArgumentException("Category must be a valid ID");
                    }
                }
                case "contentItems", "imageUrls" -> {
                    if (!(updates.get(field) instanceof List<?>)) {
                        throw new IllegalArgumentException(field + " must be a list");
                    }
                }
                case "available" -> {
                    if (!(updates.get(field) instanceof Boolean)) {
                        throw new IllegalArgumentException(field + " must be a boolean");
                    }
                }
                default -> {
                    if (!(updates.get(field) instanceof String)) {
                        throw new IllegalArgumentException(field + " must be a string");
                    }
                }
            }
        });
    }
}
