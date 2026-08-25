package com.healthcare.backend.repository;

import com.healthcare.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findBySupplierId(Long supplierId);

    List<PurchaseOrder> findByStatus(String status);

    List<PurchaseOrder> findByPaymentStatus(String paymentStatus);

    List<PurchaseOrder> findByOrderDateBetween(LocalDate start, LocalDate end);

    List<PurchaseOrder> findByItemNameContainingIgnoreCase(String itemName);

    List<PurchaseOrder> findBySupplierNameContainingIgnoreCase(String supplierName);
}