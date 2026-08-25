package com.healthcare.backend.repository;

import com.healthcare.backend.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    List<InventoryItem> findByNameContainingIgnoreCase(String name);

    List<InventoryItem> findByCategory(String category);

    List<InventoryItem> findByStatus(String status);

    List<InventoryItem> findByQuantityLessThanEqual(Integer quantity);

    List<InventoryItem> findByCategoryAndStatus(String category, String status);

    List<InventoryItem> findBySupplier(String supplier);
}