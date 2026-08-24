package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String specialization;

    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    private String experience;

    private String qualification;

    private boolean available;
}