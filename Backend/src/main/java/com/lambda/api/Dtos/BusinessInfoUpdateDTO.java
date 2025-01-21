package com.lambda.api.Dtos;

import java.util.Map;
import java.util.Set;

public record BusinessInfoUpdateDTO(Map<String, String> updates) {
    private static final Set<String> VALID_FIELDS = Set.of(
            "welcome", "about", "address", "phone", "email",
            "facebook", "instagram", "businessDays",
            "businessHours", "deliveryHours"
    );
    public BusinessInfoUpdateDTO {
        updates.keySet().forEach(field -> {
            if (!VALID_FIELDS.contains(field)) {
                throw new IllegalArgumentException("Campo inválido: " + field);
            }
        });
    }
}
