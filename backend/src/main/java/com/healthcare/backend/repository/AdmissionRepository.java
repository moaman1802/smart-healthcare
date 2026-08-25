package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    List<Admission> findByPatientEmail(String patientEmail);

    List<Admission> findByStatus(String status);

    List<Admission> findByDoctorEmail(String doctorEmail);

    List<Admission> findByBedId(Long bedId);

    List<Admission> findByPatientEmailAndStatus(String patientEmail, String status);

    List<Admission> findByWard(String ward);
}