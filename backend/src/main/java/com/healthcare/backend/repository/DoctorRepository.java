package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    // Find doctor by email (unique)
    Optional<Doctor> findByEmail(String email);
    
    // Search doctors by specialization
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    
    // Search doctors by name
    List<Doctor> findByNameContainingIgnoreCase(String name);
    
    // Find all available doctors
    List<Doctor> findByAvailableTrue();
    
    // Check if email exists
    boolean existsByEmail(String email);
}