package com.healthcare.backend.service;

import com.healthcare.backend.entity.Patient;
import com.healthcare.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    // 1. Add new patient
    public Patient addPatient(Patient patient) {
        if (patientRepository.existsByEmail(patient.getEmail())) {
            throw new RuntimeException("Patient already exists with email: " + patient.getEmail());
        }
        return patientRepository.save(patient);
    }

    // 2. Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 3. Get patient by ID
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    // 4. Get patient by email
    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    // 5. Update patient
    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(updatedPatient.getName());
            patient.setEmail(updatedPatient.getEmail());
            patient.setPhone(updatedPatient.getPhone());
            patient.setAge(updatedPatient.getAge());
            patient.setGender(updatedPatient.getGender());
            patient.setBloodGroup(updatedPatient.getBloodGroup());
            patient.setAddress(updatedPatient.getAddress());
            return patientRepository.save(patient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    // 6. Delete patient
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    // 7. Search by name
    public List<Patient> searchByName(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    // 8. Search by blood group
    public List<Patient> searchByBloodGroup(String bloodGroup) {
        return patientRepository.findByBloodGroup(bloodGroup);
    }
}