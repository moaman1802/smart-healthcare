package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String settingKey;

    @Column(nullable = false)
    private String settingValue;

    private String category; // GENERAL, SECURITY, NOTIFICATION, APPEARANCE

    private String description;

    private String dataType; // STRING, INTEGER, BOOLEAN, JSON

    private Boolean isEditable = true;
}