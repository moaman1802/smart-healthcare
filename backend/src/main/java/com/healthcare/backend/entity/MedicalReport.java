package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medical_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String patientEmail;

    private String doctorName;

    private String reportType;

    private String reportTitle;

    private LocalDate reportDate;

    private String reportUrl;

    private String status;
}