package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;

    private Integer requestedQuantity;

    private String requestor; // Doctor email or department

    private String patientEmail; // If for specific patient

    private String status; // PENDING, APPROVED, REJECTED, FULFILLED

    private LocalDate requestDate;

    private LocalDate fulfilledDate;

    private String notes;

    private String approvedBy; // Admin/Pharmacist email
}