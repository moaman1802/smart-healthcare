package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // Medical Equipment, Consumables, Furniture, etc.

    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer reorderLevel;

    private String unit; // pcs, boxes, bottles, etc.

    private Double unitPrice;

    private String supplier;

    private LocalDate purchaseDate;

    private String status; // AVAILABLE, LOW_STOCK, OUT_OF_STOCK, DISCONTINUED

    private String location; // Storage location
}