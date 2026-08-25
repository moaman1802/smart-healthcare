package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByPatientEmail(String patientEmail);

    List<Bill> findByPaymentStatus(String paymentStatus);

    List<Bill> findByPatientEmailAndPaymentStatus(String patientEmail, String paymentStatus);

    List<Bill> findByBillDateBetween(LocalDate start, LocalDate end);

    List<Bill> findByDoctorEmail(String doctorEmail);

    List<Bill> findByAppointmentId(Long appointmentId);

    boolean existsByInvoiceNumber(String invoiceNumber);
}