package com.healthcare.backend.controller;

import com.healthcare.backend.entity.PurchaseOrder;
import com.healthcare.backend.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrder order) {
        try {
            PurchaseOrder created = purchaseOrderService.createPurchaseOrder(order);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return purchaseOrderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrder>> getBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(purchaseOrderService.getOrdersBySupplier(supplierId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrder>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseOrderService.getOrdersByStatus(status));
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<PurchaseOrder>> getByPaymentStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(purchaseOrderService.getOrdersByPaymentStatus(paymentStatus));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PurchaseOrder>> getByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(purchaseOrderService.getOrdersByDateRange(startDate, endDate));
    }

    @GetMapping("/search/item")
    public ResponseEntity<List<PurchaseOrder>> searchByItem(@RequestParam String item) {
        return ResponseEntity.ok(purchaseOrderService.searchByItem(item));
    }

    @GetMapping("/search/supplier")
    public ResponseEntity<List<PurchaseOrder>> searchBySupplier(@RequestParam String supplier) {
        return ResponseEntity.ok(purchaseOrderService.searchBySupplier(supplier));
    }

    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody PurchaseOrder order) {
        try {
            PurchaseOrder updated = purchaseOrderService.updateOrder(id, order);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/admin/status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            PurchaseOrder updated = purchaseOrderService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            purchaseOrderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Purchase order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}