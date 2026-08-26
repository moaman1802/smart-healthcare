package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Department;
import com.healthcare.backend.entity.HospitalProfile;
import com.healthcare.backend.entity.SystemSetting;
import com.healthcare.backend.repository.DepartmentRepository;
import com.healthcare.backend.repository.HospitalProfileRepository;
import com.healthcare.backend.service.SystemSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminSettingsController {

    @Autowired
    private HospitalProfileRepository hospitalProfileRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SystemSettingService settingService;

    // ===== Hospital Profile =====
    @GetMapping("/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfile> getHospitalProfile() {
        List<HospitalProfile> profiles = hospitalProfileRepository.findAll();
        if (profiles.isEmpty()) {
            HospitalProfile newProfile = new HospitalProfile();
            newProfile.setHospitalName("Smart Healthcare Hospital");
            return ResponseEntity.ok(hospitalProfileRepository.save(newProfile));
        }
        return ResponseEntity.ok(profiles.get(0));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfile> updateHospitalProfile(@RequestBody HospitalProfile profile) {
        List<HospitalProfile> profiles = hospitalProfileRepository.findAll();
        if (profiles.isEmpty()) {
            return ResponseEntity.ok(hospitalProfileRepository.save(profile));
        }
        profile.setId(profiles.get(0).getId());
        return ResponseEntity.ok(hospitalProfileRepository.save(profile));
    }

    // ===== Departments =====
    @GetMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @PutMapping("/departments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
        department.setId(id);
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @DeleteMapping("/departments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Department deleted successfully"));
    }

    // ===== System Settings =====
    @GetMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemSetting>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @GetMapping("/settings/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemSetting>> getSettingsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(settingService.getSettingsByCategory(category));
    }

    @PutMapping("/settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSetting> updateSetting(@PathVariable String key, @RequestBody Map<String, String> request) {
        String value = request.get("value");
        return ResponseEntity.ok(settingService.updateSetting(key, value));
    }

    // ===== Initialize Default Settings =====
    @PostMapping("/settings/init")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> initializeSettings() {
        settingService.initializeDefaultSettings();
        return ResponseEntity.ok(Map.of("message", "Default settings initialized"));
    }
}