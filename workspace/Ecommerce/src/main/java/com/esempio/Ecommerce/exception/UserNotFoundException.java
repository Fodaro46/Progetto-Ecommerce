package com.esempio.Ecommerce.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String userId) {
        super("Utente con ID '" + userId + "' non trovato");
    }

    // Opzionale: Aggiungi costruttore alternativo
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}