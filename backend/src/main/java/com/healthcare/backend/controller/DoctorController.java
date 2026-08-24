package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // 🔐 ADMIN only - Add doctor
    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor savedDoctor = doctorService.addDoctor(doctor);
            return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 ADMIN only - Update doctor
    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 ADMIN only - Delete doctor
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 ADMIN only - Toggle availability
    @PatchMapping("/admin/toggle/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        try {
            Doctor doctor = doctorService.toggleAvailability(id);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🩺 All roles - Get all doctors
    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // 🩺 All roles - Get available doctors
    @GetMapping("/available")
    public ResponseEntity<List<Doctor>> getAvailableDoctors() {
        return ResponseEntity.ok(doctorService.getAvailableDoctors());
    }

    // 🩺 All roles - Get doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔎 All roles - Search by specialization
    @GetMapping("/search/specialization")
    public ResponseEntity<List<Doctor>> searchBySpecialization(@RequestParam String specialization) {
        return ResponseEntity.ok(doctorService.searchBySpecialization(specialization));
    }

    // 🔎 All roles - Search by name
    @GetMapping("/search/name")
    public ResponseEntity<List<Doctor>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(doctorService.searchByName(name));
    }
}