package com.healthcare.backend.repository;

import com.healthcare.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorEmail(String doctorEmail);

    List<DoctorAvailability> findByDoctorEmailAndIsActiveTrue(String doctorEmail);

    List<DoctorAvailability> findByDoctorEmailAndDayOfWeekAndIsActiveTrue(
        String doctorEmail, 
        String dayOfWeek
    );
}