package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientEmail; // User's email (patient, doctor, admin)

    @Column(nullable = false)
    private String type; // APPOINTMENT_CONFIRMATION, APPOINTMENT_REMINDER, APPOINTMENT_CANCELLATION,
                         // REPORT_UPLOADED, PAYMENT_CONFIRMATION, LOW_STOCK_ALERT, ANNOUNCEMENT, etc.

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    private String link; // Frontend link to redirect (e.g., /appointment/123)

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}