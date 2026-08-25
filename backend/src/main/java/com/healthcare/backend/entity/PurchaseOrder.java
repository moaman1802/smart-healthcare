package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String poNumber;

    private Long supplierId;

    private String supplierName;

    private String itemName;

    private Integer quantity;

    private Double unitPrice;

    private Double totalAmount;

    private LocalDate orderDate;

    private LocalDate deliveryDate;

    private String status; // PENDING, RECEIVED, CANCELLED

    private String paymentStatus; // PENDING, PAID

    private String notes;
}