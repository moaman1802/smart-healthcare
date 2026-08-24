package com.healthcare.backend.service;

import com.healthcare.backend.entity.Prescription;
import com.healthcare.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    // 1. Add new prescription
    public Prescription addPrescription(Prescription prescription) {
        prescription.setPrescribedDate(LocalDate.now());
        prescription.setStatus("ACTIVE");
        return prescriptionRepository.save(prescription);
    }

    // 2. Get all prescriptions
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // 3. Get by patient email
    public List<Prescription> getByPatientEmail(String patientEmail) {
        return prescriptionRepository.findByPatientEmail(patientEmail);
    }

    // 4. Get by doctor email
    public List<Prescription> getByDoctorEmail(String doctorEmail) {
        return prescriptionRepository.findByDoctorEmail(doctorEmail);
    }

    // 5. Get by ID
    public Optional<Prescription> getById(Long id) {
        return prescriptionRepository.findById(id);
    }

    // 6. Get active prescriptions for patient
    public List<Prescription> getActiveByPatient(String patientEmail) {
        return prescriptionRepository.findByPatientEmailAndStatus(patientEmail, "ACTIVE");
    }

    // 7. Update prescription
    public Prescription updatePrescription(Long id, Prescription updated) {
        return prescriptionRepository.findById(id).map(pres -> {
            pres.setMedicineName(updated.getMedicineName());
            pres.setDosage(updated.getDosage());
            pres.setFrequency(updated.getFrequency());
            pres.setDuration(updated.getDuration());
            pres.setInstructions(updated.getInstructions());
            pres.setStatus(updated.getStatus());
            return prescriptionRepository.save(pres);
        }).orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    // 8. Update status only
    public Prescription updateStatus(Long id, String status) {
        return prescriptionRepository.findById(id).map(pres -> {
            pres.setStatus(status);
            return prescriptionRepository.save(pres);
        }).orElseThrow(() -> new RuntimeException("Prescription not found"));
    }

    // 9. Delete prescription
    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription not found");
        }
        prescriptionRepository.deleteById(id);
    }

    // 10. Get by appointment ID
    public List<Prescription> getByAppointmentId(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }

    // 11. Search by medicine name
    public List<Prescription> searchByMedicine(String medicineName) {
        return prescriptionRepository.findByMedicineNameContainingIgnoreCase(medicineName);
    }
}