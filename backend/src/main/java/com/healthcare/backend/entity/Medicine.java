package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // Antibiotic, Painkiller, Syrup, Injection, etc.

    private String manufacturer;

    private String composition;

    private String dosageForm; // Tablet, Capsule, Syrup, Injection, Cream, etc.

    private String strength; // 500mg, 250mg/5ml, etc.

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private LocalDate expiryDate;

    private String storageConditions;

    private String description;

    private String status; // ACTIVE, INACTIVE, OUT_OF_STOCK
}