package com.lambda.api.Dtos;

import java.util.List;

public record BannerDTO(String tittle, String description, List<String> images_url) {
}
