package com.healthcare.backend.service;

import com.healthcare.backend.entity.DoctorAvailability;
import com.healthcare.backend.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    // Add availability
    public DoctorAvailability addAvailability(DoctorAvailability availability) {
        availability.setIsActive(true);
        return availabilityRepository.save(availability);
    }

    // Get all by doctor
    public List<DoctorAvailability> getByDoctor(String doctorEmail) {
        return availabilityRepository.findByDoctorEmail(doctorEmail);
    }

    // Get active by doctor
    public List<DoctorAvailability> getActiveByDoctor(String doctorEmail) {
        return availabilityRepository.findByDoctorEmailAndIsActiveTrue(doctorEmail);
    }

    // Update availability
    public DoctorAvailability updateAvailability(Long id, DoctorAvailability updated) {
        return availabilityRepository.findById(id).map(avail -> {
            avail.setDayOfWeek(updated.getDayOfWeek());
            avail.setStartTime(updated.getStartTime());
            avail.setEndTime(updated.getEndTime());
            avail.setSlotDuration(updated.getSlotDuration());
            avail.setIsActive(updated.getIsActive());
            return availabilityRepository.save(avail);
        }).orElseThrow(() -> new RuntimeException("Availability not found"));
    }

    // Toggle active status
    public DoctorAvailability toggleActive(Long id) {
        return availabilityRepository.findById(id).map(avail -> {
            avail.setIsActive(!avail.getIsActive());
            return availabilityRepository.save(avail);
        }).orElseThrow(() -> new RuntimeException("Availability not found"));
    }

    // Delete availability
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }

    // Get available time slots for a specific date
    public List<LocalTime> getAvailableSlots(String doctorEmail, String dayOfWeek) {
        List<DoctorAvailability> availabilities = availabilityRepository
                .findByDoctorEmailAndDayOfWeekAndIsActiveTrue(doctorEmail, dayOfWeek);
        
        List<LocalTime> slots = new ArrayList<>();
        
        for (DoctorAvailability avail : availabilities) {
            LocalTime current = avail.getStartTime();
            int duration = avail.getSlotDuration() != null ? avail.getSlotDuration() : 30;
            
            while (current.isBefore(avail.getEndTime())) {
                slots.add(current);
                current = current.plusMinutes(duration);
            }
        }
        
        return slots;
    }
}