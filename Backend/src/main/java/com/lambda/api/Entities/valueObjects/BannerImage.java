package com.lambda.api.Entities.valueObjects;

import jakarta.persistence.Embeddable;

@Embeddable
public record BannerImage(Long image_id, String url) {
}
