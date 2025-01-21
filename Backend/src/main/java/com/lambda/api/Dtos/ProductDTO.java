package com.lambda.api.Dtos;

public record ProductDTO(Long id, String name, String unitOfMeasure, Double quantity, Double purchaseCost,
                         Double cost, Double profitMargin, Double price, Integer minimumOrder, Boolean available) {
}
