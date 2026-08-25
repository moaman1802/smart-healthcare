package com.healthcare.backend.controller;

import com.healthcare.backend.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class BillingDashboardController {

    @Autowired
    private BillRepository billRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalBills = billRepository.count();
        long pendingBills = billRepository.findByPaymentStatus("PENDING").size();
        long paidBills = billRepository.findByPaymentStatus("PAID").size();
        long partialBills = billRepository.findByPaymentStatus("PARTIAL").size();
        
        // Total revenue (sum of totalAmount for PAID bills)
        Double totalRevenue = billRepository.findByPaymentStatus("PAID").stream()
                .mapToDouble(bill -> bill.getTotalAmount() != null ? bill.getTotalAmount() : 0.0)
                .sum();
        
        Double pendingAmount = billRepository.findByPaymentStatus("PENDING").stream()
                .mapToDouble(bill -> bill.getTotalAmount() != null ? bill.getTotalAmount() : 0.0)
                .sum();
        
        // Monthly revenue (current month)
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
        Double monthlyRevenue = billRepository.findByBillDateBetween(startOfMonth, endOfMonth).stream()
                .filter(b -> "PAID".equals(b.getPaymentStatus()))
                .mapToDouble(bill -> bill.getTotalAmount() != null ? bill.getTotalAmount() : 0.0)
                .sum();

        stats.put("totalBills", totalBills);
        stats.put("pendingBills", pendingBills);
        stats.put("paidBills", paidBills);
        stats.put("partialBills", partialBills);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingAmount", pendingAmount);
        stats.put("monthlyRevenue", monthlyRevenue);
        
        return ResponseEntity.ok(stats);
    }
}