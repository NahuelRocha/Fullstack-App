package com.lambda.api.Entities.valueObjects;

import com.lambda.api.Exceptions.InvalidUnitOfMeasureException;

public enum UnitOfMeasure {
    UNIT,
    KILOGRAM;

    public static UnitOfMeasure fromString(String value) {
        try {
            return UnitOfMeasure.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidUnitOfMeasureException("Invalid unit of measure: " + value);
        }
    }
}
