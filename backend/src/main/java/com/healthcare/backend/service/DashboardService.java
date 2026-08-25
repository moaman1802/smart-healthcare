package com.healthcare.backend.service;

import com.healthcare.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalReports", medicalReportRepository.count());
        stats.put("totalPrescriptions", prescriptionRepository.count());
        return stats;
    }

    public List<Map<String, Object>> getRecentActivity(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // Recent Appointments
        appointmentRepository.findAll().stream()
                .sorted((a1, a2) -> a2.getId().compareTo(a1.getId())) // simplest order by id desc
                .limit(limit)
                .forEach(app -> {
                    Map<String, Object> activity = new LinkedHashMap<>();
                    activity.put("type", "APPOINTMENT");
                    activity.put("message", "Appointment booked for " + app.getPatientName() + " with Dr. " + app.getDoctorName());
                    activity.put("date", app.getAppointmentDate() + " " + app.getAppointmentTime());
                    activity.put("status", app.getStatus());
                    activities.add(activity);
                });

        // If we want more variety, we can add reports, prescriptions etc.
        // For now, we return appointments as recent activity.
        return activities;
    }
}