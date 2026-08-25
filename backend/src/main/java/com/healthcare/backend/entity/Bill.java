package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientEmail;

    private String patientName;

    private String doctorEmail;

    private String doctorName;

    private Long appointmentId;

    private String serviceType; // Consultation, Lab Test, Pharmacy, Surgery, etc.

    private Double amount;

    private Double tax;

    private Double totalAmount;

    private String paymentStatus; // PENDING, PAID, PARTIAL, CANCELLED

    private LocalDate billDate;

    private LocalDate dueDate;

    private String description;

    private String invoiceNumber;
}