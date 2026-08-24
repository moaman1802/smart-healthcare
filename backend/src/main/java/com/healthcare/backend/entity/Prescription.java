package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientEmail;

    private String patientName;

    private String doctorEmail;

    private String doctorName;

    private Long appointmentId; // Optional - link to appointment

    private String medicineName;

    private String dosage; // e.g., 500mg, 1 tablet

    private String frequency; // e.g., twice daily, once daily

    private String duration; // e.g., 5 days, 2 weeks

    private String instructions; // e.g., Take after meals

    private LocalDate prescribedDate;

    private String status; // ACTIVE, COMPLETED, EXPIRED
}