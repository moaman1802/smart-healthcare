package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Admission;
import com.healthcare.backend.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admissions")
@CrossOrigin(origins = "http://localhost:5173")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @PostMapping("/admit")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> admitPatient(@RequestBody Admission admission) {
        try {
            Admission admitted = admissionService.admitPatient(admission);
            return new ResponseEntity<>(admitted, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Admission>> getActiveAdmissions() {
        return ResponseEntity.ok(admissionService.getActiveAdmissions());
    }

    @GetMapping("/patient/{email}")
    public ResponseEntity<List<Admission>> getByPatient(@PathVariable String email) {
        return ResponseEntity.ok(admissionService.getByPatientEmail(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return admissionService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/discharge/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> dischargePatient(@PathVariable Long id) {
        try {
            Admission discharged = admissionService.dischargePatient(id);
            return ResponseEntity.ok(discharged);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Admission>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(admissionService.getByStatus(status));
    }

    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAdmission(@PathVariable Long id, @RequestBody Admission admission) {
        try {
            Admission updated = admissionService.updateAdmission(id, admission);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAdmission(@PathVariable Long id) {
        try {
            admissionService.deleteAdmission(id);
            return ResponseEntity.ok(Map.of("message", "Admission deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}