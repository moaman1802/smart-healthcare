package com.healthcare.backend.repository;

import com.healthcare.backend.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    List<LabTest> findByPatientEmail(String patientEmail);

    List<LabTest> findByDoctorEmail(String doctorEmail);

    List<LabTest> findByStatus(String status);

    List<LabTest> findByPatientEmailAndStatus(String patientEmail, String status);

    List<LabTest> findByTestType(String testType);
}