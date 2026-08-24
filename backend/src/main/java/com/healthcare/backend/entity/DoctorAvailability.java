package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doctorEmail;

    private String dayOfWeek; // MONDAY, TUESDAY, etc.

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer slotDuration; // in minutes (default 30)

    private Boolean isActive = true;
}