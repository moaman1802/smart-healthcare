package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import com.healthcare.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // 📅 Patient - Book appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment booked = appointmentService.bookAppointment(appointment);
            return new ResponseEntity<>(booked, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🩺 All roles - Get all appointments (Admin/Doctor)
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // 🔍 All roles - Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 👤 Patient - Get my appointments
    @GetMapping("/patient/{email}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable String email) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(email));
    }

    // 👨‍⚕️ Doctor - Get my appointments
    @GetMapping("/doctor/{email}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(email));
    }

    // 📊 All roles - Get appointments by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    // ✅ Doctor/Admin - Confirm appointment
    @PatchMapping("/confirm/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id) {
        try {
            Appointment confirmed = appointmentService.confirmAppointment(id);
            return ResponseEntity.ok(confirmed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🏁 Doctor - Complete appointment
    @PatchMapping("/complete/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id) {
        try {
            Appointment completed = appointmentService.completeAppointment(id);
            return ResponseEntity.ok(completed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ❌ Patient/Admin - Cancel appointment
    @PatchMapping("/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment cancelled = appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🗑️ Admin - Delete appointment
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔎 Check if slot is available
    @GetMapping("/check-slot")
    public ResponseEntity<?> checkSlotAvailability(
            @RequestParam String doctorEmail,
            @RequestParam String date,
            @RequestParam String time) {
        
        try {
            java.time.LocalDate localDate = java.time.LocalDate.parse(date);
            java.time.LocalTime localTime = java.time.LocalTime.parse(time);
            
            boolean available = appointmentService.isSlotAvailable(doctorEmail, localDate, localTime);
            return ResponseEntity.ok(Map.of("available", available));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date/time format"));
        }
    }
}