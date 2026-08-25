package com.healthcare.backend.service;

import com.healthcare.backend.entity.Admission;
import com.healthcare.backend.entity.Bed;
import com.healthcare.backend.repository.AdmissionRepository;
import com.healthcare.backend.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private BedRepository bedRepository;

    @Transactional
    public Admission admitPatient(Admission admission) {
        admission.setAdmissionDate(LocalDate.now());
        admission.setStatus("ADMITTED");
        Admission saved = admissionRepository.save(admission);
        // Update bed status
        bedRepository.findById(admission.getBedId()).ifPresent(bed -> {
            bed.setStatus("OCCUPIED");
            bedRepository.save(bed);
        });
        return saved;
    }

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public Optional<Admission> getById(Long id) {
        return admissionRepository.findById(id);
    }

    public List<Admission> getByPatientEmail(String email) {
        return admissionRepository.findByPatientEmail(email);
    }

    public List<Admission> getByStatus(String status) {
        return admissionRepository.findByStatus(status);
    }

    @Transactional
    public Admission dischargePatient(Long id) {
        return admissionRepository.findById(id).map(admission -> {
            admission.setDischargeDate(LocalDate.now());
            admission.setStatus("DISCHARGED");
            // Update bed status
            bedRepository.findById(admission.getBedId()).ifPresent(bed -> {
                bed.setStatus("AVAILABLE");
                bedRepository.save(bed);
            });
            return admissionRepository.save(admission);
        }).orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    public Admission updateAdmission(Long id, Admission updated) {
        return admissionRepository.findById(id).map(admission -> {
            admission.setPatientEmail(updated.getPatientEmail());
            admission.setPatientName(updated.getPatientName());
            admission.setDoctorEmail(updated.getDoctorEmail());
            admission.setDoctorName(updated.getDoctorName());
            admission.setBedId(updated.getBedId());
            admission.setBedNumber(updated.getBedNumber());
            admission.setWard(updated.getWard());
            admission.setReason(updated.getReason());
            admission.setDiagnosis(updated.getDiagnosis());
            admission.setNotes(updated.getNotes());
            return admissionRepository.save(admission);
        }).orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    public void deleteAdmission(Long id) {
        if (!admissionRepository.existsById(id)) {
            throw new RuntimeException("Admission not found");
        }
        admissionRepository.deleteById(id);
    }

    public List<Admission> getActiveAdmissions() {
        return admissionRepository.findByStatus("ADMITTED");
    }
}