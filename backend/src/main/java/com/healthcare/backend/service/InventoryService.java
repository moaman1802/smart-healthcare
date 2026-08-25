package com.healthcare.backend.service;

import com.healthcare.backend.entity.InventoryItem;
import com.healthcare.backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    // 1. Add item
    public InventoryItem addItem(InventoryItem item) {
        if (item.getStatus() == null) {
            item.setStatus("AVAILABLE");
        }
        if (item.getQuantity() <= 0) {
            item.setStatus("OUT_OF_STOCK");
        }
        return inventoryRepository.save(item);
    }

    // 2. Get all items
    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    // 3. Get by ID
    public Optional<InventoryItem> getById(Long id) {
        return inventoryRepository.findById(id);
    }

    // 4. Search by name
    public List<InventoryItem> searchByName(String name) {
        return inventoryRepository.findByNameContainingIgnoreCase(name);
    }

    // 5. Get by category
    public List<InventoryItem> getByCategory(String category) {
        return inventoryRepository.findByCategory(category);
    }

    // 6. Get by status
    public List<InventoryItem> getByStatus(String status) {
        return inventoryRepository.findByStatus(status);
    }

    // 7. Get low stock items
    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findByQuantityLessThanEqual(10);
    }

    // 8. Update item
    public InventoryItem updateItem(Long id, InventoryItem updated) {
        return inventoryRepository.findById(id).map(item -> {
            item.setName(updated.getName());
            item.setCategory(updated.getCategory());
            item.setDescription(updated.getDescription());
            item.setQuantity(updated.getQuantity());
            item.setReorderLevel(updated.getReorderLevel());
            item.setUnit(updated.getUnit());
            item.setUnitPrice(updated.getUnitPrice());
            item.setSupplier(updated.getSupplier());
            item.setPurchaseDate(updated.getPurchaseDate());
            item.setLocation(updated.getLocation());
            // Update status based on quantity
            if (item.getQuantity() <= 0) {
                item.setStatus("OUT_OF_STOCK");
            } else if (item.getQuantity() <= item.getReorderLevel()) {
                item.setStatus("LOW_STOCK");
            } else {
                item.setStatus("AVAILABLE");
            }
            return inventoryRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    // 9. Update quantity
    public InventoryItem updateQuantity(Long id, Integer quantity) {
        return inventoryRepository.findById(id).map(item -> {
            item.setQuantity(quantity);
            if (quantity <= 0) {
                item.setStatus("OUT_OF_STOCK");
            } else if (quantity <= item.getReorderLevel()) {
                item.setStatus("LOW_STOCK");
            } else {
                item.setStatus("AVAILABLE");
            }
            return inventoryRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    // 10. Delete item
    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        inventoryRepository.deleteById(id);
    }
}