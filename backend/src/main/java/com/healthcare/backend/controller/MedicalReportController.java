package com.healthcare.backend.controller;

import com.healthcare.backend.entity.MedicalReport;
import com.healthcare.backend.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalReportController {

    @Autowired
    private MedicalReportService reportService;

    // 👨‍⚕️ Doctor - Add report for patient
    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addReport(@RequestBody MedicalReport report) {
        try {
            MedicalReport saved = reportService.addReport(report);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Get all reports
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MedicalReport>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // 👤 Patient - Get my reports
    @GetMapping("/patient/{email}")
    public ResponseEntity<List<MedicalReport>> getByPatient(@PathVariable String email) {
        return ResponseEntity.ok(reportService.getByPatientEmail(email));
    }

    // 👨‍⚕️ Doctor - Get reports by doctor
    @GetMapping("/doctor/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalReport>> getByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(reportService.getByDoctorEmail(email));
    }

    // 🩺 All - Get report by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return reportService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👨‍⚕️ Doctor - Update report
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateReport(@PathVariable Long id, @RequestBody MedicalReport report) {
        try {
            MedicalReport updated = reportService.updateReport(id, report);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Update status
    @PatchMapping("/status/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            MedicalReport updated = reportService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Delete report
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Search by patient name
    @GetMapping("/search")
    public ResponseEntity<List<MedicalReport>> searchByPatient(@RequestParam String name) {
        return ResponseEntity.ok(reportService.searchByPatientName(name));
    }

    // 📊 Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MedicalReport>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reportService.getByStatus(status));
    }
}