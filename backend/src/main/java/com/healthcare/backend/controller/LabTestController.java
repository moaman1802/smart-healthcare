package com.healthcare.backend.controller;

import com.healthcare.backend.entity.LabTest;
import com.healthcare.backend.service.LabTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lab")
@CrossOrigin(origins = "http://localhost:5173")
public class LabTestController {

    @Autowired
    private LabTestService labTestService;

    // 👨‍⚕️ Doctor - Add lab test for patient
    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addLabTest(@RequestBody LabTest labTest) {
        try {
            LabTest saved = labTestService.addLabTest(labTest);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Get all lab tests
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return ResponseEntity.ok(labTestService.getAllLabTests());
    }

    // 👤 Patient - Get my lab tests
    @GetMapping("/patient/{email}")
    public ResponseEntity<List<LabTest>> getByPatient(@PathVariable String email) {
        return ResponseEntity.ok(labTestService.getByPatientEmail(email));
    }

    // 👨‍⚕️ Doctor - Get lab tests by doctor
    @GetMapping("/doctor/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<LabTest>> getByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(labTestService.getByDoctorEmail(email));
    }

    // 🩺 All - Get lab test by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return labTestService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👨‍⚕️ Doctor - Update lab test
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateLabTest(@PathVariable Long id, @RequestBody LabTest labTest) {
        try {
            LabTest updated = labTestService.updateLabTest(id, labTest);
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
            LabTest updated = labTestService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Delete lab test
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLabTest(@PathVariable Long id) {
        try {
            labTestService.deleteLabTest(id);
            return ResponseEntity.ok(Map.of("message", "Lab test deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LabTest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(labTestService.getByStatus(status));
    }

    // 🔍 Get by test type
    @GetMapping("/type/{testType}")
    public ResponseEntity<List<LabTest>> getByTestType(@PathVariable String testType) {
        return ResponseEntity.ok(labTestService.getByTestType(testType));
    }
}