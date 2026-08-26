package com.healthcare.backend.controller;

import com.healthcare.backend.service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPatientStats() {
        return ResponseEntity.ok(reportsService.getPatientStats());
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDoctorStats() {
        return ResponseEntity.ok(reportsService.getDoctorStats());
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAppointmentStats() {
        return ResponseEntity.ok(reportsService.getAppointmentStats());
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        return ResponseEntity.ok(reportsService.getRevenueStats());
    }

    @GetMapping("/laboratory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getLabStats() {
        return ResponseEntity.ok(reportsService.getLabStats());
    }

    @GetMapping("/pharmacy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPharmacyStats() {
        return ResponseEntity.ok(reportsService.getPharmacyStats());
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getInventoryStats() {
        return ResponseEntity.ok(reportsService.getInventoryStats());
    }

    @GetMapping("/monthly-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMonthlyActivity() {
        return ResponseEntity.ok(reportsService.getMonthlyActivity());
    }
}