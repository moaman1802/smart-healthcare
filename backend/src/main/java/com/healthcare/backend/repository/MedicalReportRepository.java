package com.healthcare.backend.repository;

import com.healthcare.backend.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    List<MedicalReport> findByPatientEmail(String patientEmail);

    List<MedicalReport> findByDoctorName(String doctorName);  // ✅ Changed

    List<MedicalReport> findByPatientNameContainingIgnoreCase(String patientName);

    List<MedicalReport> findByStatus(String status);
}