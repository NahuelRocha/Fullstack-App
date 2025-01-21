package com.lambda.api.Exceptions;

public class InvalidUnitOfMeasureException extends RuntimeException {
    public InvalidUnitOfMeasureException(String message) {
        super(message);
    }
}