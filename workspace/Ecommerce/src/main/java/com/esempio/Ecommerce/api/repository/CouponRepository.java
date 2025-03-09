package com.esempio.Ecommerce.api.repository;

import com.esempio.Ecommerce.domain.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE " +
            "c.code = :code AND " +
            "c.isActive = true AND " +
            "(c.expirationDate IS NULL OR c.expirationDate > :currentDate)")
    Optional<Coupon> findValidCoupon(String code, LocalDateTime currentDate);

    boolean existsByCode(String code);

    @Query("SELECT COUNT(c) > 0 FROM Coupon c WHERE " +
            "c.code = :code AND " +
            "c.expirationDate < :currentDate")
    boolean isCouponExpired(String code, LocalDateTime currentDate);
}