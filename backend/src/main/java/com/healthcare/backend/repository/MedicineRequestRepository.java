package com.healthcare.backend.repository;

import com.healthcare.backend.entity.MedicineRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRequestRepository extends JpaRepository<MedicineRequest, Long> {

    List<MedicineRequest> findByStatus(String status);

    List<MedicineRequest> findByRequestor(String requestor);

    List<MedicineRequest> findByPatientEmail(String patientEmail);

    List<MedicineRequest> findByMedicineNameContainingIgnoreCase(String medicineName);
}