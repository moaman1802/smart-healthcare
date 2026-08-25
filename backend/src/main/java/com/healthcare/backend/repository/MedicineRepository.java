package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByNameContainingIgnoreCase(String name);

    List<Medicine> findByCategory(String category);

    List<Medicine> findByStatus(String status);

    List<Medicine> findByExpiryDateBefore(LocalDate date);

    List<Medicine> findByQuantityLessThan(Integer quantity);

    List<Medicine> findByCategoryAndStatus(String category, String status);

    boolean existsByNameIgnoreCase(String name);
}