package com.healthcare.backend.service;

import com.healthcare.backend.entity.MedicalReport;
import com.healthcare.backend.repository.MedicalReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalReportService {

    @Autowired
    private MedicalReportRepository reportRepository;

    // 1. Add new report
    public MedicalReport addReport(MedicalReport report) {
        report.setReportDate(LocalDate.now());
        report.setStatus("PENDING");
        return reportRepository.save(report);
    }

    // 2. Get all reports
    public List<MedicalReport> getAllReports() {
        return reportRepository.findAll();
    }

    // 3. Get by patient email
    public List<MedicalReport> getByPatientEmail(String email) {
        return reportRepository.findByPatientEmail(email);
    }

    // 4. Get by doctor email
    public List<MedicalReport> getByDoctorEmail(String email) {
        return reportRepository.findByDoctorName(email);
    }

    // 5. Get by ID
    public Optional<MedicalReport> getById(Long id) {
        return reportRepository.findById(id);
    }

    // 6. Update report
    public MedicalReport updateReport(Long id, MedicalReport updated) {
        return reportRepository.findById(id).map(report -> {
            report.setReportType(updated.getReportType());
            report.setReportTitle(updated.getReportTitle());
            report.setReportUrl(updated.getReportUrl());
            report.setStatus(updated.getStatus());
            return reportRepository.save(report);
        }).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    // 7. Update status only
    public MedicalReport updateStatus(Long id, String status) {
        return reportRepository.findById(id).map(report -> {
            report.setStatus(status);
            return reportRepository.save(report);
        }).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    // 8. Delete report
    public void deleteReport(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new RuntimeException("Report not found");
        }
        reportRepository.deleteById(id);
    }

    // 9. Search by patient name
    public List<MedicalReport> searchByPatientName(String name) {
        return reportRepository.findByPatientNameContainingIgnoreCase(name);
    }

    // 10. Get by status
    public List<MedicalReport> getByStatus(String status) {
        return reportRepository.findByStatus(status);
    }
}