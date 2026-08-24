package com.healthcare.backend.service;

import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // 1. Add new doctor
    public Doctor addDoctor(Doctor doctor) {
        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Doctor already exists with email: " + doctor.getEmail());
        }
        return doctorRepository.save(doctor);
    }

    // 2. Get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 3. Get all available doctors
    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailableTrue();
    }

    // 4. Get doctor by ID
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // 5. Update doctor
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setName(updatedDoctor.getName());
            doctor.setSpecialization(updatedDoctor.getSpecialization());
            doctor.setPhone(updatedDoctor.getPhone());
            doctor.setEmail(updatedDoctor.getEmail());
            doctor.setExperience(updatedDoctor.getExperience());
            doctor.setQualification(updatedDoctor.getQualification());
            doctor.setAvailable(updatedDoctor.isAvailable());
            return doctorRepository.save(doctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    // 6. Delete doctor
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    // 7. Search by specialization
    public List<Doctor> searchBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    // 8. Search by name
    public List<Doctor> searchByName(String name) {
        return doctorRepository.findByNameContainingIgnoreCase(name);
    }

    // 9. Toggle availability
    public Doctor toggleAvailability(Long id) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setAvailable(!doctor.isAvailable());
            return doctorRepository.save(doctor);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }
}