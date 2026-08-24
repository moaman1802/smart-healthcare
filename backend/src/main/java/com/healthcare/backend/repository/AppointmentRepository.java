package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by patient email
    List<Appointment> findByPatientEmail(String patientEmail);

    // Find appointments by doctor email
    List<Appointment> findByDoctorEmail(String doctorEmail);

    // Find appointments by status
    List<Appointment> findByStatus(AppointmentStatus status);

    // Find appointments by doctor and date
    List<Appointment> findByDoctorEmailAndAppointmentDate(String doctorEmail, LocalDate date);

    // Find appointments by patient and status
    List<Appointment> findByPatientEmailAndStatus(String patientEmail, AppointmentStatus status);

    // Check if doctor already has appointment at that date and time
    boolean existsByDoctorEmailAndAppointmentDateAndAppointmentTime(
            String doctorEmail,
            LocalDate date,
            java.time.LocalTime time
    );
}