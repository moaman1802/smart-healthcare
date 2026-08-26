package com.healthcare.backend.repository;

import com.healthcare.backend.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalProfileRepository extends JpaRepository<HospitalProfile, Long> {
}