package com.healthcare.backend.service;

import com.healthcare.backend.entity.Bill;
import com.healthcare.backend.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    // 1. Generate new bill
    public Bill generateBill(Bill bill) {
        bill.setBillDate(LocalDate.now());
        bill.setDueDate(LocalDate.now().plusDays(15));
        bill.setPaymentStatus("PENDING");
        bill.setInvoiceNumber(generateInvoiceNumber());
        if (bill.getTax() == null) {
            bill.setTax(0.0);
        }
        if (bill.getTotalAmount() == null) {
            bill.setTotalAmount(bill.getAmount() + bill.getTax());
        }
        return billRepository.save(bill);
    }

    // 2. Get all bills
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // 3. Get by patient email
    public List<Bill> getByPatientEmail(String email) {
        return billRepository.findByPatientEmail(email);
    }

    // 4. Get by payment status
    public List<Bill> getByPaymentStatus(String status) {
        return billRepository.findByPaymentStatus(status);
    }

    // 5. Get by ID
    public Optional<Bill> getById(Long id) {
        return billRepository.findById(id);
    }

    // 6. Update payment status
    public Bill updatePaymentStatus(Long id, String status) {
        return billRepository.findById(id).map(bill -> {
            bill.setPaymentStatus(status);
            return billRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    // 7. Update bill
    public Bill updateBill(Long id, Bill updated) {
        return billRepository.findById(id).map(bill -> {
            bill.setServiceType(updated.getServiceType());
            bill.setAmount(updated.getAmount());
            bill.setTax(updated.getTax());
            bill.setTotalAmount(updated.getAmount() + updated.getTax());
            bill.setDescription(updated.getDescription());
            return billRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    // 8. Delete bill
    public void deleteBill(Long id) {
        if (!billRepository.existsById(id)) {
            throw new RuntimeException("Bill not found");
        }
        billRepository.deleteById(id);
    }

    // 9. Get bills by date range
    public List<Bill> getBillsByDateRange(LocalDate start, LocalDate end) {
        return billRepository.findByBillDateBetween(start, end);
    }

    // 10. Get patient pending bills
    public List<Bill> getPatientPendingBills(String email) {
        return billRepository.findByPatientEmailAndPaymentStatus(email, "PENDING");
    }

    // 11. Get by appointment ID
    public List<Bill> getByAppointmentId(Long appointmentId) {
        return billRepository.findByAppointmentId(appointmentId);
    }

    private String generateInvoiceNumber() {
        String prefix = "INV-";
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = billRepository.count() + 1;
        return prefix + date + "-" + String.format("%04d", count);
    }
}