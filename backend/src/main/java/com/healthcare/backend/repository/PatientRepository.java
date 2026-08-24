package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Find patient by email
    Optional<Patient> findByEmail(String email);

    // Search patients by name
    List<Patient> findByNameContainingIgnoreCase(String name);

    // Check if email exists
    boolean existsByEmail(String email);

    // Find patients by blood group
    List<Patient> findByBloodGroup(String bloodGroup);

    // Find patients by gender
    List<Patient> findByGender(String gender);
}