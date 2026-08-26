package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hospital_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HospitalProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hospitalName;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private String phone;

    private String email;

    private String website;

    private String registrationNumber;

    private String establishedYear;

    private String about;

    private String logoUrl;

    private String workingHours;

    private String emergencyContact;
}