package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private Integer totalBeds;

    private Integer availableBeds;

    private String location; // Floor, building etc.

    private String status; // ACTIVE, INACTIVE

    private String headDoctor; // Optional
}