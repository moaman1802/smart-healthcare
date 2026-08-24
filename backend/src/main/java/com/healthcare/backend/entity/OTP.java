package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private String purpose; // REGISTRATION, LOGIN, FORGOT_PASSWORD

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    private Integer attempts = 0;

    private Boolean verified = false;

    private LocalDateTime createdAt;
}