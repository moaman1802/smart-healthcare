package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Bill;
import com.healthcare.backend.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    @Autowired
    private BillService billService;

    // 💰 Admin/Staff - Generate bill
    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> generateBill(@RequestBody Bill bill) {
        try {
            Bill generated = billService.generateBill(bill);
            return new ResponseEntity<>(generated, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Get all bills
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    // 👤 Patient - Get my bills
    @GetMapping("/patient/{email}")
    public ResponseEntity<List<Bill>> getByPatient(@PathVariable String email) {
        return ResponseEntity.ok(billService.getByPatientEmail(email));
    }

    // 🩺 All - Get bill by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return billService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔐 Admin - Update payment status
    @PatchMapping("/admin/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Bill updated = billService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Update bill
    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        try {
            Bill updated = billService.updateBill(id, bill);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔐 Admin - Delete bill
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBill(@PathVariable Long id) {
        try {
            billService.deleteBill(id);
            return ResponseEntity.ok(Map.of("message", "Bill deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 🔍 Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bill>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(billService.getByPaymentStatus(status));
    }

    // 👤 Patient - Get pending bills
    @GetMapping("/patient/{email}/pending")
    public ResponseEntity<List<Bill>> getPatientPendingBills(@PathVariable String email) {
        return ResponseEntity.ok(billService.getPatientPendingBills(email));
    }
}