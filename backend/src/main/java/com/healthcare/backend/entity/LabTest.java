package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lab_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientEmail;

    private String patientName;

    private String doctorEmail;

    private String doctorName;

    private String testName;

    private String testType; // Blood, Urine, X-Ray, MRI, etc.

    private LocalDate testDate;

    private String result;

    private String normalRange;

    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    private String remarks;

    private String reportUrl; // Link to uploaded report file
}