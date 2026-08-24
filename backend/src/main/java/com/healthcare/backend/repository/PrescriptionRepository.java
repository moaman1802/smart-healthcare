package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Get prescriptions by patient email
    List<Prescription> findByPatientEmail(String patientEmail);

    // Get prescriptions by doctor email
    List<Prescription> findByDoctorEmail(String doctorEmail);

    // Get active prescriptions for a patient
    List<Prescription> findByPatientEmailAndStatus(String patientEmail, String status);

    // Get prescriptions by status
    List<Prescription> findByStatus(String status);

    // Get prescriptions by appointment ID
    List<Prescription> findByAppointmentId(Long appointmentId);

    // Search by medicine name
    List<Prescription> findByMedicineNameContainingIgnoreCase(String medicineName);
}