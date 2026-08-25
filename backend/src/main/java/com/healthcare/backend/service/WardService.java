package com.healthcare.backend.service;

import com.healthcare.backend.entity.Ward;
import com.healthcare.backend.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WardService {

    @Autowired
    private WardRepository wardRepository;

    // 1. Add new ward
    public Ward addWard(Ward ward) {
        if (ward.getStatus() == null) {
            ward.setStatus("ACTIVE");
        }
        if (ward.getAvailableBeds() == null) {
            ward.setAvailableBeds(ward.getTotalBeds() != null ? ward.getTotalBeds() : 0);
        }
        return wardRepository.save(ward);
    }

    // 2. Get all wards
    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    // 3. Get by ID
    public Optional<Ward> getWardById(Long id) {
        return wardRepository.findById(id);
    }

    // 4. Get by status
    public List<Ward> getWardsByStatus(String status) {
        return wardRepository.findByStatus(status);
    }

    // 5. Get available wards (with beds > 0)
    public List<Ward> getAvailableWards() {
        return wardRepository.findByAvailableBedsGreaterThan(0);
    }

    // 6. Search by name
    public List<Ward> searchWards(String name) {
        return wardRepository.findByNameContainingIgnoreCase(name);
    }

    // 7. Update ward
    public Ward updateWard(Long id, Ward updated) {
        return wardRepository.findById(id).map(ward -> {
            ward.setName(updated.getName());
            ward.setDescription(updated.getDescription());
            ward.setTotalBeds(updated.getTotalBeds());
            ward.setLocation(updated.getLocation());
            ward.setStatus(updated.getStatus());
            ward.setHeadDoctor(updated.getHeadDoctor());
            // Update available beds if total beds changed
            if (updated.getTotalBeds() != null && ward.getTotalBeds() != null) {
                int diff = updated.getTotalBeds() - ward.getTotalBeds();
                int newAvailable = ward.getAvailableBeds() + diff;
                ward.setAvailableBeds(Math.max(0, newAvailable));
            }
            return wardRepository.save(ward);
        }).orElseThrow(() -> new RuntimeException("Ward not found"));
    }

    // 8. Update available beds (when patient admitted/discharged)
    public Ward updateAvailableBeds(Long id, Integer change) {
        return wardRepository.findById(id).map(ward -> {
            int newAvailable = ward.getAvailableBeds() + change;
            ward.setAvailableBeds(Math.max(0, newAvailable));
            return wardRepository.save(ward);
        }).orElseThrow(() -> new RuntimeException("Ward not found"));
    }

    // 9. Delete ward
    public void deleteWard(Long id) {
        if (!wardRepository.existsById(id)) {
            throw new RuntimeException("Ward not found");
        }
        wardRepository.deleteById(id);
    }
}