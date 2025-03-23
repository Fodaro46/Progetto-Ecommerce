package com.esempio.Ecommerce.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "short_description", nullable = false, unique = true)
    private String shortDescription;

    @Column(name = "long_description", nullable = false, unique = true)
    private String longDescription;

    @Column(name = "price", nullable = false)
    private Double price;

    @OneToOne(mappedBy = "product", cascade = CascadeType.REMOVE, optional = false, orphanRemoval = true)
    @JsonManagedReference
    private Inventory inventory;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime updatedAt;
}
