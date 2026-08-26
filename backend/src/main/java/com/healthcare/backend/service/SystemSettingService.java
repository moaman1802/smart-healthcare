package com.healthcare.backend.service;

import com.healthcare.backend.entity.SystemSetting;
import com.healthcare.backend.repository.SystemSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemSettingService {

    @Autowired
    private SystemSettingRepository settingRepository;

    public List<SystemSetting> getAllSettings() {
        return settingRepository.findAll();
    }

    public List<SystemSetting> getSettingsByCategory(String category) {
        return settingRepository.findByCategory(category);
    }

    public Optional<SystemSetting> getSettingByKey(String key) {
        return settingRepository.findBySettingKey(key);
    }

    public SystemSetting updateSetting(String key, String value) {
        SystemSetting setting = settingRepository.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("Setting not found: " + key));
        setting.setSettingValue(value);
        return settingRepository.save(setting);
    }

    public SystemSetting createSetting(SystemSetting setting) {
        return settingRepository.save(setting);
    }

    public void deleteSetting(Long id) {
        settingRepository.deleteById(id);
    }

    // ===== Default Settings =====
    public void initializeDefaultSettings() {
        if (settingRepository.count() == 0) {
            // Security Settings
            createSetting(new SystemSetting(null, "otp.enabled", "true", "SECURITY", "Enable OTP verification", "BOOLEAN", true));
            createSetting(new SystemSetting(null, "otp.expiry.minutes", "5", "SECURITY", "OTP expiry time in minutes", "INTEGER", true));
            createSetting(new SystemSetting(null, "max.login.attempts", "5", "SECURITY", "Maximum login attempts before lockout", "INTEGER", true));

            // Notification Settings
            createSetting(new SystemSetting(null, "appointment.reminder.enabled", "true", "NOTIFICATION", "Send appointment reminders", "BOOLEAN", true));
            createSetting(new SystemSetting(null, "appointment.reminder.hours", "24", "NOTIFICATION", "Hours before appointment to send reminder", "INTEGER", true));
            createSetting(new SystemSetting(null, "report.upload.notification", "true", "NOTIFICATION", "Notify patient when report is uploaded", "BOOLEAN", true));
            createSetting(new SystemSetting(null, "payment.confirmation.enabled", "true", "NOTIFICATION", "Send payment confirmation notifications", "BOOLEAN", true));

            // General Settings
            createSetting(new SystemSetting(null, "app.timezone", "Asia/Kolkata", "GENERAL", "Application timezone", "STRING", true));
            createSetting(new SystemSetting(null, "date.format", "dd-MM-yyyy", "GENERAL", "Date display format", "STRING", true));
            createSetting(new SystemSetting(null, "currency.symbol", "₹", "GENERAL", "Currency symbol", "STRING", true));

            // Appearance
            createSetting(new SystemSetting(null, "theme.primary.color", "#0f4c81", "APPEARANCE", "Primary theme color", "STRING", true));
            createSetting(new SystemSetting(null, "theme.secondary.color", "#00b4d8", "APPEARANCE", "Secondary theme color", "STRING", true));
        }
    }
}