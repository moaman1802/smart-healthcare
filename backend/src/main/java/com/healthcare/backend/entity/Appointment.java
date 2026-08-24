package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String patientEmail;

    private String doctorName;

    private String doctorEmail;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String reason;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
}