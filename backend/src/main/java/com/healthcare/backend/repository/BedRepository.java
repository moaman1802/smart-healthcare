package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {

    List<Bed> findByStatus(String status);

    List<Bed> findByWard(String ward);

    List<Bed> findByBedType(String bedType);

    List<Bed> findByWardAndStatus(String ward, String status);

    List<Bed> findByBedNumberContainingIgnoreCase(String bedNumber);
}