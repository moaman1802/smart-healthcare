package com.healthcare.backend.repository;

import com.healthcare.backend.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    List<SystemSetting> findByCategory(String category);
    Optional<SystemSetting> findBySettingKey(String key);
}