package com.healthcare.backend.service;

import com.healthcare.backend.entity.Supplier;
import com.healthcare.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    // 1. Add supplier
    public Supplier addSupplier(Supplier supplier) {
        if (supplier.getStatus() == null) {
            supplier.setStatus("ACTIVE");
        }
        return supplierRepository.save(supplier);
    }

    // 2. Get all suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // 3. Get by ID
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    // 4. Search by name
    public List<Supplier> searchSuppliers(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }

    // 5. Get by status
    public List<Supplier> getSuppliersByStatus(String status) {
        return supplierRepository.findByStatus(status);
    }

    // 6. Update supplier
    public Supplier updateSupplier(Long id, Supplier updated) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(updated.getName());
            supplier.setContactPerson(updated.getContactPerson());
            supplier.setEmail(updated.getEmail());
            supplier.setPhone(updated.getPhone());
            supplier.setAddress(updated.getAddress());
            supplier.setGstNumber(updated.getGstNumber());
            supplier.setStatus(updated.getStatus());
            supplier.setNotes(updated.getNotes());
            return supplierRepository.save(supplier);
        }).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    // 7. Delete supplier
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found");
        }
        supplierRepository.deleteById(id);
    }
}