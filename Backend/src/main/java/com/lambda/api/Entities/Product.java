package com.lambda.api.Entities;

import com.lambda.api.Dtos.CreateProductDTO;
import com.lambda.api.Dtos.ProductUpdateDTO;
import com.lambda.api.Entities.valueObjects.UnitOfMeasure;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(name = "unit_of_measure")
    private UnitOfMeasure unitOfMeasure;
    @Column(name = "quantity")
    private Double quantity;
    @Column(name = "purchase_cost")
    private Double purchaseCost;
    private Double cost;
    @Column(name = "prof_margin")
    private Double profitMargin;
    private Double price;
    @Column(name = "min_order")
    private Integer minimumOrder;
    private Boolean available;
    @Version
    private Long version;

    public Product(){}
    private Product(String name, UnitOfMeasure unitOfMeasure, Double quantity, Double purchaseCost,
                    Double profitMargin, Integer minimumOrder, Boolean available){
        this.name = name;
        this.unitOfMeasure = unitOfMeasure;
        this.quantity = quantity;
        this.purchaseCost = purchaseCost;
        this.cost = calculateCost();
        this.profitMargin = profitMargin;
        this.price = calculatePrice();
        this.minimumOrder = minimumOrder;
        this.available = available;
    }

    public static Product createProduct(CreateProductDTO productDto) {

        var unitOfMeasure = UnitOfMeasure.fromString(productDto.unitOfMeasure());

        return new Product(
                productDto.name(),
                unitOfMeasure,
                productDto.quantity(),
                productDto.purchaseCost(),
                productDto.profitMargin(),
                productDto.minimumOrder(),
                productDto.available()
        );

    }

    private Double calculateCost() {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }
        double result = purchaseCost / quantity;
        return roundToTwoDecimals(result);
    }

    private Double calculatePrice() {

        if (cost == null || cost <= 0) {
            throw new IllegalStateException("Cost must be calculated before calculating price.");
        }
        if (profitMargin == null || profitMargin < 0) {
            throw new IllegalArgumentException("Profit margin must be non-negative.");
        }
        double result = cost + (cost * profitMargin / 100);
        return roundToTwoDecimals(result);
    }

    public void updateProduct(ProductUpdateDTO updateDTO) {
        if (updateDTO.name() != null) {
            this.name = updateDTO.name();
        }
        if (updateDTO.unitOfMeasure() != null) {
            this.unitOfMeasure = UnitOfMeasure.fromString(updateDTO.unitOfMeasure());
        }
        if (updateDTO.quantity() != null) {
            this.quantity = updateDTO.quantity();
            this.cost = calculateCost();
            this.price = calculatePrice();
        }
        if (updateDTO.purchaseCost() != null) {
            this.purchaseCost = updateDTO.purchaseCost();
            this.cost = calculateCost();
            this.price = calculatePrice();
        }
        if (updateDTO.profitMargin() != null) {
            this.profitMargin = updateDTO.profitMargin();
            this.price = calculatePrice();
        }
        if (updateDTO.minimumOrder() != null) {
            this.minimumOrder = updateDTO.minimumOrder();
        }
        if (updateDTO.available() != null) {
            this.available = updateDTO.available();
        }
    }

    private static double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public UnitOfMeasure getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public Double getQuantity() {
        return quantity;
    }

    public Double getPurchaseCost() {
        return purchaseCost;
    }

    public Double getCost() {
        return cost;
    }

    public Double getProfitMargin() {
        return profitMargin;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getMinimumOrder() {
        return minimumOrder;
    }

    public Boolean getAvailable() {
        return available;
    }
}
