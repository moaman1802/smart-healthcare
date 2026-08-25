package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Ward;
import com.healthcare.backend.service.WardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "http://localhost:5173")
public class WardController {

    @Autowired
    private WardService wardService;

    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addWard(@RequestBody Ward ward) {
        try {
            Ward saved = wardService.addWard(ward);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ward>> getAllWards() {
        return ResponseEntity.ok(wardService.getAllWards());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Ward>> getAvailableWards() {
        return ResponseEntity.ok(wardService.getAvailableWards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWardById(@PathVariable Long id) {
        return wardService.getWardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ward>> getWardsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(wardService.getWardsByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ward>> searchWards(@RequestParam String name) {
        return ResponseEntity.ok(wardService.searchWards(name));
    }

    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateWard(@PathVariable Long id, @RequestBody Ward ward) {
        try {
            Ward updated = wardService.updateWard(id, ward);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/admin/available/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAvailableBeds(@PathVariable Long id, @RequestParam Integer change) {
        try {
            Ward updated = wardService.updateAvailableBeds(id, change);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteWard(@PathVariable Long id) {
        try {
            wardService.deleteWard(id);
            return ResponseEntity.ok(Map.of("message", "Ward deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}