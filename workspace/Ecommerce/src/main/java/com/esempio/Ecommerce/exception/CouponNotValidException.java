package com.esempio.Ecommerce.exception;
public class CouponNotValidException extends RuntimeException {
    public CouponNotValidException(String couponCode) {
        super("Coupon " + couponCode + " non valido");
    }
}