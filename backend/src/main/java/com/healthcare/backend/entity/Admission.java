package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientEmail;

    private String patientName;

    private String doctorEmail;

    private String doctorName;

    private Long bedId;

    private String bedNumber;

    private String ward;

    private LocalDate admissionDate;

    private LocalDate dischargeDate;

    private String reason;

    private String diagnosis;

    private String status; // ADMITTED, DISCHARGED, TRANSFERRED

    private String notes;
}