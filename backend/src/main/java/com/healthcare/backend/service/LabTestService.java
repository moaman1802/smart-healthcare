package com.healthcare.backend.service;

import com.healthcare.backend.entity.LabTest;
import com.healthcare.backend.repository.LabTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LabTestService {

    @Autowired
    private LabTestRepository labTestRepository;

    // 1. Add new lab test
    public LabTest addLabTest(LabTest labTest) {
        labTest.setTestDate(LocalDate.now());
        labTest.setStatus("PENDING");
        return labTestRepository.save(labTest);
    }

    // 2. Get all lab tests
    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    // 3. Get by patient email
    public List<LabTest> getByPatientEmail(String email) {
        return labTestRepository.findByPatientEmail(email);
    }

    // 4. Get by doctor email
    public List<LabTest> getByDoctorEmail(String email) {
        return labTestRepository.findByDoctorEmail(email);
    }

    // 5. Get by status
    public List<LabTest> getByStatus(String status) {
        return labTestRepository.findByStatus(status);
    }

    // 6. Get by ID
    public Optional<LabTest> getById(Long id) {
        return labTestRepository.findById(id);
    }

    // 7. Update lab test
    public LabTest updateLabTest(Long id, LabTest updated) {
        return labTestRepository.findById(id).map(test -> {
            test.setTestName(updated.getTestName());
            test.setTestType(updated.getTestType());
            test.setResult(updated.getResult());
            test.setNormalRange(updated.getNormalRange());
            test.setStatus(updated.getStatus());
            test.setRemarks(updated.getRemarks());
            test.setReportUrl(updated.getReportUrl());
            return labTestRepository.save(test);
        }).orElseThrow(() -> new RuntimeException("Lab test not found"));
    }

    // 8. Update status only
    public LabTest updateStatus(Long id, String status) {
        return labTestRepository.findById(id).map(test -> {
            test.setStatus(status);
            return labTestRepository.save(test);
        }).orElseThrow(() -> new RuntimeException("Lab test not found"));
    }

    // 9. Delete lab test
    public void deleteLabTest(Long id) {
        if (!labTestRepository.existsById(id)) {
            throw new RuntimeException("Lab test not found");
        }
        labTestRepository.deleteById(id);
    }

    // 10. Get by patient and status
    public List<LabTest> getByPatientAndStatus(String email, String status) {
        return labTestRepository.findByPatientEmailAndStatus(email, status);
    }

    // 11. Get by test type
    public List<LabTest> getByTestType(String testType) {
        return labTestRepository.findByTestType(testType);
    }
}