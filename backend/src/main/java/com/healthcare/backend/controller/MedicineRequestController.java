package com.healthcare.backend.controller;

import com.healthcare.backend.entity.MedicineRequest;
import com.healthcare.backend.service.MedicineRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicine-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicineRequestController {

    @Autowired
    private MedicineRequestService requestService;

    // 👨‍⚕️ Doctor - Create request
    @PostMapping("/create")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> createRequest(@RequestBody MedicineRequest request) {
        try {
            MedicineRequest created = requestService.createRequest(request);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin/Pharmacist - Get all requests
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<List<MedicineRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    // 👨‍⚕️ Doctor - Get my requests
    @GetMapping("/doctor/{email}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<MedicineRequest>> getByDoctor(@PathVariable String email) {
        return ResponseEntity.ok(requestService.getByRequestor(email));
    }

    // 🩺 All - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return requestService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔐 Admin/Pharmacist - Update status
    @PatchMapping("/admin/status/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status,
                                          @RequestParam(required = false) String approvedBy) {
        try {
            MedicineRequest updated = requestService.updateStatus(id, status, approvedBy);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 👨‍⚕️ Doctor - Update request (before approval)
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateRequest(@PathVariable Long id, @RequestBody MedicineRequest request) {
        try {
            MedicineRequest updated = requestService.updateRequest(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Delete request
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            requestService.deleteRequest(id);
            return ResponseEntity.ok(Map.of("message", "Request deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MedicineRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(requestService.getByStatus(status));
    }
}