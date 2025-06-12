package com.esempio.Ecommerce.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String userId) {
        super("Utente con ID '" + userId + "' non trovato");
    }
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}