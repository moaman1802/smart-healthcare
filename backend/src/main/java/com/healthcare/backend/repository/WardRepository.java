package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {

    List<Ward> findByNameContainingIgnoreCase(String name);

    List<Ward> findByStatus(String status);

    List<Ward> findByAvailableBedsGreaterThan(Integer beds);
}