package com.healthcare.backend.service;

import com.healthcare.backend.entity.Bed;
import com.healthcare.backend.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BedService {

    @Autowired
    private BedRepository bedRepository;

    public Bed addBed(Bed bed) {
        if (bed.getStatus() == null) {
            bed.setStatus("AVAILABLE");
        }
        return bedRepository.save(bed);
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public Optional<Bed> getById(Long id) {
        return bedRepository.findById(id);
    }

    public List<Bed> getByStatus(String status) {
        return bedRepository.findByStatus(status);
    }

    public List<Bed> getByWard(String ward) {
        return bedRepository.findByWard(ward);
    }

    public List<Bed> getAvailableBeds() {
        return bedRepository.findByStatus("AVAILABLE");
    }

    public Bed updateBed(Long id, Bed updated) {
        return bedRepository.findById(id).map(bed -> {
            bed.setBedNumber(updated.getBedNumber());
            bed.setWard(updated.getWard());
            bed.setRoomNumber(updated.getRoomNumber());
            bed.setBedType(updated.getBedType());
            bed.setStatus(updated.getStatus());
            bed.setDailyRate(updated.getDailyRate());
            bed.setDescription(updated.getDescription());
            return bedRepository.save(bed);
        }).orElseThrow(() -> new RuntimeException("Bed not found"));
    }

    public Bed updateStatus(Long id, String status) {
        return bedRepository.findById(id).map(bed -> {
            bed.setStatus(status);
            return bedRepository.save(bed);
        }).orElseThrow(() -> new RuntimeException("Bed not found"));
    }

    public void deleteBed(Long id) {
        if (!bedRepository.existsById(id)) {
            throw new RuntimeException("Bed not found");
        }
        bedRepository.deleteById(id);
    }
}