package com.healthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bedNumber;

    @Column(nullable = false)
    private String ward; // General, ICU, Maternity, Pediatric, etc.

    private String roomNumber;

    private String bedType; // General, ICU, VIP, etc.

    private String status; // AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE

    private Double dailyRate;

    private String description;
}