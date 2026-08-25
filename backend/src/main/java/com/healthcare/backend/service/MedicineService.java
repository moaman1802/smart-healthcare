package com.healthcare.backend.service;

import com.healthcare.backend.entity.Medicine;
import com.healthcare.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    // 1. Add new medicine
    public Medicine addMedicine(Medicine medicine) {
        if (medicineRepository.existsByNameIgnoreCase(medicine.getName())) {
            throw new RuntimeException("Medicine already exists: " + medicine.getName());
        }
        if (medicine.getStatus() == null) {
            medicine.setStatus("ACTIVE");
        }
        return medicineRepository.save(medicine);
    }

    // 2. Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // 3. Get by ID
    public Optional<Medicine> getById(Long id) {
        return medicineRepository.findById(id);
    }

    // 4. Search by name
    public List<Medicine> searchByName(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name);
    }

    // 5. Get by category
    public List<Medicine> getByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }

    // 6. Get by status
    public List<Medicine> getByStatus(String status) {
        return medicineRepository.findByStatus(status);
    }

    // 7. Get expired medicines
    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }

    // 8. Get low stock medicines
    public List<Medicine> getLowStockMedicines(Integer threshold) {
        return medicineRepository.findByQuantityLessThan(threshold);
    }

    // 9. Update medicine
    public Medicine updateMedicine(Long id, Medicine updated) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(updated.getName());
            medicine.setCategory(updated.getCategory());
            medicine.setManufacturer(updated.getManufacturer());
            medicine.setComposition(updated.getComposition());
            medicine.setDosageForm(updated.getDosageForm());
            medicine.setStrength(updated.getStrength());
            medicine.setQuantity(updated.getQuantity());
            medicine.setPrice(updated.getPrice());
            medicine.setExpiryDate(updated.getExpiryDate());
            medicine.setStorageConditions(updated.getStorageConditions());
            medicine.setDescription(updated.getDescription());
            medicine.setStatus(updated.getStatus());
            return medicineRepository.save(medicine);
        }).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // 10. Update stock quantity
    public Medicine updateStock(Long id, Integer quantity) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setQuantity(quantity);
            // Auto-update status based on quantity
            if (quantity <= 0) {
                medicine.setStatus("OUT_OF_STOCK");
            } else if ("OUT_OF_STOCK".equals(medicine.getStatus())) {
                medicine.setStatus("ACTIVE");
            }
            return medicineRepository.save(medicine);
        }).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // 11. Update status
    public Medicine updateStatus(Long id, String status) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setStatus(status);
            return medicineRepository.save(medicine);
        }).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // 12. Delete medicine
    public void deleteMedicine(Long id) {
        if (!medicineRepository.existsById(id)) {
            throw new RuntimeException("Medicine not found");
        }
        medicineRepository.deleteById(id);
    }

    // 13. Get active medicines by category
    public List<Medicine> getActiveByCategory(String category) {
        return medicineRepository.findByCategoryAndStatus(category, "ACTIVE");
    }
}