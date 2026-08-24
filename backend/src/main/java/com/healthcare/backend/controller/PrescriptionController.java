package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Prescription;
import com.healthcare.backend.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    // 👨‍⚕️ Doctor - Add prescription
    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addPrescription(@RequestBody Prescription prescription) {
        try {
            Prescription saved = prescriptionService.addPrescription(prescription);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Get all prescriptions
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    // 👤 Patient - Get my prescriptions
    @GetMapping("/patient/{email}")
    public ResponseEntity<List<Prescription>> getByPatient(@PathVariable String email) {
        return ResponseEntity.ok(prescriptionService.getByPatientEmail(email));
    }

    // 👤 Patient - Get active prescriptions
    @GetMapping("/patient/{email}/active")
    public ResponseEntity<List<Prescription>> getActiveByPatient(@PathVariable String email) {
        return ResponseEntity.ok(prescriptionService.getActiveByPatient(email));
    }

    // 👨‍⚕️ Doctor - Get prescriptions by doctor
    @GetMapping("/doctor/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<Prescription>> getByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(prescriptionService.getByDoctorEmail(email));
    }

    // 🩺 All - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return prescriptionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👨‍⚕️ Doctor - Update prescription
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        try {
            Prescription updated = prescriptionService.updatePrescription(id, prescription);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Update status (COMPLETED/EXPIRED)
    @PatchMapping("/status/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Prescription updated = prescriptionService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Delete prescription
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.ok(Map.of("message", "Prescription deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Search by medicine name
    @GetMapping("/search")
    public ResponseEntity<List<Prescription>> searchByMedicine(@RequestParam String medicine) {
        return ResponseEntity.ok(prescriptionService.searchByMedicine(medicine));
    }
}