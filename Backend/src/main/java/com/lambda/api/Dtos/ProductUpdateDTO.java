package com.lambda.api.Dtos;

public record ProductUpdateDTO(
        String name,
        String unitOfMeasure,
        Double quantity,
        Double purchaseCost,
        Double profitMargin,
        Integer minimumOrder,
        Boolean available
) {
    public ProductUpdateDTO {
        // Validaciones básicas
        if (quantity != null && quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (purchaseCost != null && purchaseCost <= 0) {
            throw new IllegalArgumentException("Purchase cost must be greater than 0");
        }
        if (profitMargin != null && profitMargin < 0) {
            throw new IllegalArgumentException("Profit margin must be non-negative");
        }
        if (minimumOrder != null && minimumOrder < 1) {
            throw new IllegalArgumentException("Minimum order must be at least 1");
        }
    }
}
