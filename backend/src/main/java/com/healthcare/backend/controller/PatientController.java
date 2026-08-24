package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Patient;
import com.healthcare.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // 🔐 ADMIN only - Add patient
    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addPatient(@RequestBody Patient patient) {
        try {
            Patient saved = patientService.addPatient(patient);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 ADMIN only - Get all patients
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    // 🔐 ADMIN only - Delete patient
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👤 Patient/Admin - Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👤 Patient - Get my own profile by email (patient uses their email)
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getPatientByEmail(@PathVariable String email) {
        return patientService.getPatientByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👤 Patient - Update own profile
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        try {
            Patient updated = patientService.updatePatient(id, patient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Search by name (anyone)
    @GetMapping("/search/name")
    public ResponseEntity<List<Patient>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(patientService.searchByName(name));
    }

    // 🔍 Search by blood group
    @GetMapping("/search/bloodgroup")
    public ResponseEntity<List<Patient>> searchByBloodGroup(@RequestParam String bloodGroup) {
        return ResponseEntity.ok(patientService.searchByBloodGroup(bloodGroup));
    }
}