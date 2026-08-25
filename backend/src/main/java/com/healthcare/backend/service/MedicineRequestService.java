package com.healthcare.backend.service;

import com.healthcare.backend.entity.MedicineRequest;
import com.healthcare.backend.repository.MedicineRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineRequestService {

    @Autowired
    private MedicineRequestRepository requestRepository;

    // 1. Create new request
    public MedicineRequest createRequest(MedicineRequest request) {
        request.setRequestDate(LocalDate.now());
        request.setStatus("PENDING");
        return requestRepository.save(request);
    }

    // 2. Get all requests
    public List<MedicineRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    // 3. Get by status
    public List<MedicineRequest> getByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    // 4. Get by requestor (doctor)
    public List<MedicineRequest> getByRequestor(String requestor) {
        return requestRepository.findByRequestor(requestor);
    }

    // 5. Get by patient email
    public List<MedicineRequest> getByPatient(String email) {
        return requestRepository.findByPatientEmail(email);
    }

    // 6. Get by ID
    public Optional<MedicineRequest> getById(Long id) {
        return requestRepository.findById(id);
    }

    // 7. Update status (Approve/Reject/Fulfill)
    public MedicineRequest updateStatus(Long id, String status, String approvedBy) {
        return requestRepository.findById(id).map(req -> {
            req.setStatus(status);
            if (status.equals("FULFILLED")) {
                req.setFulfilledDate(LocalDate.now());
            }
            if (approvedBy != null) {
                req.setApprovedBy(approvedBy);
            }
            return requestRepository.save(req);
        }).orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // 8. Update request (doctor can edit before approval)
    public MedicineRequest updateRequest(Long id, MedicineRequest updated) {
        return requestRepository.findById(id).map(req -> {
            req.setMedicineName(updated.getMedicineName());
            req.setRequestedQuantity(updated.getRequestedQuantity());
            req.setNotes(updated.getNotes());
            return requestRepository.save(req);
        }).orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // 9. Delete request
    public void deleteRequest(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new RuntimeException("Request not found");
        }
        requestRepository.deleteById(id);
    }

    // 10. Get pending requests count (for dashboard)
    public long getPendingCount() {
        return requestRepository.findByStatus("PENDING").size();
    }
}