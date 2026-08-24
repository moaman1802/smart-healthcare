package com.healthcare.backend.controller;

import com.healthcare.backend.entity.DoctorAvailability;
import com.healthcare.backend.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityService availabilityService;

    // 👨‍⚕️ Doctor - Add availability
    @PostMapping("/add")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> addAvailability(@RequestBody DoctorAvailability availability) {
        try {
            DoctorAvailability saved = availabilityService.addAvailability(availability);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Get my availability
    @GetMapping("/doctor/{email}")
    public ResponseEntity<List<DoctorAvailability>> getByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(availabilityService.getByDoctor(email));
    }

    // 👨‍⚕️ Doctor - Get active availability
    @GetMapping("/doctor/{email}/active")
    public ResponseEntity<List<DoctorAvailability>> getActiveByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(availabilityService.getActiveByDoctor(email));
    }

    // 👨‍⚕️ Doctor - Update availability
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody DoctorAvailability availability) {
        try {
            DoctorAvailability updated = availabilityService.updateAvailability(id, availability);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Toggle active
    @PatchMapping("/toggle/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> toggleActive(@PathVariable Long id) {
        try {
            DoctorAvailability updated = availabilityService.toggleActive(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Delete availability
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        try {
            availabilityService.deleteAvailability(id);
            return ResponseEntity.ok(Map.of("message", "Availability deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Get available slots for a doctor on a specific day
    @GetMapping("/slots")
    public ResponseEntity<?> getAvailableSlots(
            @RequestParam String doctorEmail,
            @RequestParam String dayOfWeek) {
        try {
            List<LocalTime> slots = availabilityService.getAvailableSlots(doctorEmail, dayOfWeek);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}