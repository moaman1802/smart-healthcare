package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    List<Supplier> findByNameContainingIgnoreCase(String name);

    List<Supplier> findByStatus(String status);

    List<Supplier> findByEmail(String email);
}