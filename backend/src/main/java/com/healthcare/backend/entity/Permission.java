package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "MANAGE_DOCTORS", "VIEW_PATIENTS", "MANAGE_BILLING"

    private String description;

    private String category; // DOCTOR, PATIENT, APPOINTMENT, BILLING, PHARMACY, etc.
}