package com.healthcare.backend.service;

import com.healthcare.backend.entity.PurchaseOrder;
import com.healthcare.backend.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    // 1. Create new purchase order
    public PurchaseOrder createPurchaseOrder(PurchaseOrder order) {
        order.setOrderDate(LocalDate.now());
        order.setPoNumber(generatePONumber());
        if (order.getStatus() == null) {
            order.setStatus("PENDING");
        }
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("PENDING");
        }
        // Calculate total
        if (order.getQuantity() != null && order.getUnitPrice() != null) {
            order.setTotalAmount(order.getQuantity() * order.getUnitPrice());
        }
        return purchaseOrderRepository.save(order);
    }

    // 2. Get all orders
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    // 3. Get by ID
    public Optional<PurchaseOrder> getOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    // 4. Get by supplier
    public List<PurchaseOrder> getOrdersBySupplier(Long supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId);
    }

    // 5. Get by status
    public List<PurchaseOrder> getOrdersByStatus(String status) {
        return purchaseOrderRepository.findByStatus(status);
    }

    // 6. Get by payment status
    public List<PurchaseOrder> getOrdersByPaymentStatus(String paymentStatus) {
        return purchaseOrderRepository.findByPaymentStatus(paymentStatus);
    }

    // 7. Get by date range
    public List<PurchaseOrder> getOrdersByDateRange(LocalDate start, LocalDate end) {
        return purchaseOrderRepository.findByOrderDateBetween(start, end);
    }

    // 8. Search by item name
    public List<PurchaseOrder> searchByItem(String itemName) {
        return purchaseOrderRepository.findByItemNameContainingIgnoreCase(itemName);
    }

    // 9. Search by supplier name
    public List<PurchaseOrder> searchBySupplier(String supplierName) {
        return purchaseOrderRepository.findBySupplierNameContainingIgnoreCase(supplierName);
    }

    // 10. Update order
    public PurchaseOrder updateOrder(Long id, PurchaseOrder updated) {
        return purchaseOrderRepository.findById(id).map(order -> {
            order.setSupplierId(updated.getSupplierId());
            order.setSupplierName(updated.getSupplierName());
            order.setItemName(updated.getItemName());
            order.setQuantity(updated.getQuantity());
            order.setUnitPrice(updated.getUnitPrice());
            order.setTotalAmount(updated.getQuantity() * updated.getUnitPrice());
            order.setDeliveryDate(updated.getDeliveryDate());
            order.setStatus(updated.getStatus());
            order.setPaymentStatus(updated.getPaymentStatus());
            order.setNotes(updated.getNotes());
            return purchaseOrderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    // 11. Update status
    public PurchaseOrder updateStatus(Long id, String status) {
        return purchaseOrderRepository.findById(id).map(order -> {
            order.setStatus(status);
            if (status.equals("RECEIVED")) {
                // Optionally update inventory stock here
            }
            return purchaseOrderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    // 12. Delete order
    public void deleteOrder(Long id) {
        if (!purchaseOrderRepository.existsById(id)) {
            throw new RuntimeException("Purchase order not found");
        }
        purchaseOrderRepository.deleteById(id);
    }

    // 13. Generate PO number
    private String generatePONumber() {
        String prefix = "PO-";
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = purchaseOrderRepository.count() + 1;
        return prefix + date + "-" + String.format("%04d", count);
    }
}