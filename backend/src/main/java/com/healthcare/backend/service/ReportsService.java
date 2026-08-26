package com.healthcare.backend.service;

import com.healthcare.backend.entity.*;
import com.healthcare.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private LabTestRepository labTestRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    // ===== PATIENT STATISTICS =====
    public Map<String, Object> getPatientStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("byGender", patientRepository.findAll().stream()
                .collect(Collectors.groupingBy(p -> p.getGender() != null ? p.getGender() : "Unknown", Collectors.counting())));
        stats.put("byBloodGroup", patientRepository.findAll().stream()
                .collect(Collectors.groupingBy(p -> p.getBloodGroup() != null ? p.getBloodGroup() : "Unknown", Collectors.counting())));
        return stats;
    }

    // ===== DOCTOR STATISTICS =====
    public Map<String, Object> getDoctorStats() {
        List<Doctor> all = doctorRepository.findAll();
        long total = all.size();
        long available = all.stream().filter(Doctor::isAvailable).count();
        Map<String, Long> bySpecialization = all.stream()
                .collect(Collectors.groupingBy(
                    d -> d.getSpecialization() != null ? d.getSpecialization() : "Unknown",
                    Collectors.counting()
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", total);
        stats.put("availableDoctors", available);
        stats.put("bySpecialization", bySpecialization);
        return stats;
    }

    // ===== APPOINTMENT STATISTICS =====
    public Map<String, Object> getAppointmentStats() {
        List<Appointment> all = appointmentRepository.findAll();
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(
                    a -> a.getStatus() != null ? a.getStatus().name() : "UNKNOWN",
                    Collectors.counting()
                ));
        Map<String, Long> monthly = all.stream()
                .filter(a -> a.getAppointmentDate() != null)
                .collect(Collectors.groupingBy(
                    a -> a.getAppointmentDate().getYear() + "-" + String.format("%02d", a.getAppointmentDate().getMonthValue()),
                    Collectors.counting()
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", all.size());
        stats.put("byStatus", byStatus);
        stats.put("monthlyAppointments", monthly);
        return stats;
    }

    // ===== REVENUE REPORTS =====
    public Map<String, Object> getRevenueStats() {
        List<Bill> all = billRepository.findAll();
        double totalRevenue = all.stream()
                .filter(b -> "PAID".equals(b.getPaymentStatus()))
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                .sum();
        double pendingAmount = all.stream()
                .filter(b -> "PENDING".equals(b.getPaymentStatus()))
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                .sum();
        Map<String, Double> byService = all.stream()
                .collect(Collectors.groupingBy(
                    b -> b.getServiceType() != null ? b.getServiceType() : "Other",
                    Collectors.summingDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                ));
        Map<String, Double> monthlyRevenue = all.stream()
                .filter(b -> "PAID".equals(b.getPaymentStatus()) && b.getBillDate() != null)
                .collect(Collectors.groupingBy(
                    b -> b.getBillDate().getYear() + "-" + String.format("%02d", b.getBillDate().getMonthValue()),
                    Collectors.summingDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingAmount", pendingAmount);
        stats.put("byServiceType", byService);
        stats.put("monthlyRevenue", monthlyRevenue);
        return stats;
    }

    // ===== LABORATORY REPORTS =====
    public Map<String, Object> getLabStats() {
        List<LabTest> all = labTestRepository.findAll();
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(
                    l -> l.getStatus() != null ? l.getStatus() : "UNKNOWN",
                    Collectors.counting()
                ));
        Map<String, Long> byType = all.stream()
                .collect(Collectors.groupingBy(
                    l -> l.getTestType() != null ? l.getTestType() : "Other",
                    Collectors.counting()
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTests", all.size());
        stats.put("byStatus", byStatus);
        stats.put("byTestType", byType);
        return stats;
    }

    // ===== PHARMACY REPORTS =====
    public Map<String, Object> getPharmacyStats() {
        List<Medicine> all = medicineRepository.findAll();
        long lowStock = all.stream().filter(m -> m.getQuantity() != null && m.getQuantity() < 10).count();
        long expired = all.stream()
                .filter(m -> m.getExpiryDate() != null && m.getExpiryDate().isBefore(LocalDate.now()))
                .count();
        Map<String, Long> byCategory = all.stream()
                .collect(Collectors.groupingBy(
                    m -> m.getCategory() != null ? m.getCategory() : "Other",
                    Collectors.counting()
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", all.size());
        stats.put("lowStock", lowStock);
        stats.put("expiredMedicines", expired);
        stats.put("byCategory", byCategory);
        return stats;
    }

    // ===== INVENTORY REPORTS =====
    public Map<String, Object> getInventoryStats() {
        List<InventoryItem> all = inventoryRepository.findAll();
        Map<String, Long> byCategory = all.stream()
                .collect(Collectors.groupingBy(
                    i -> i.getCategory() != null ? i.getCategory() : "Other",
                    Collectors.counting()
                ));
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(
                    i -> i.getStatus() != null ? i.getStatus() : "UNKNOWN",
                    Collectors.counting()
                ));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalItems", all.size());
        stats.put("byCategory", byCategory);
        stats.put("byStatus", byStatus);
        return stats;
    }

    // ===== MONTHLY HOSPITAL ACTIVITY =====
    public Map<String, Object> getMonthlyActivity() {
        LocalDate now = LocalDate.now();
        LocalDate sixMonthsAgo = now.minusMonths(6);
        List<Appointment> all = appointmentRepository.findAll().stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().isAfter(sixMonthsAgo))
                .collect(Collectors.toList());
        Map<String, Long> monthly = all.stream()
                .collect(Collectors.groupingBy(
                    a -> a.getAppointmentDate().getYear() + "-" + String.format("%02d", a.getAppointmentDate().getMonthValue()),
                    Collectors.counting()
                ));
        Map<String, Object> activity = new HashMap<>();
        activity.put("totalAppointments", all.size());
        activity.put("monthlyAppointments", monthly);
        return activity;
    }
}