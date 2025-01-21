package com.lambda.api.Dtos;

public record CreateProductDTO(String name, String unitOfMeasure, Double quantity, Double purchaseCost,
                               Double profitMargin, Integer minimumOrder, Boolean available) {
}
