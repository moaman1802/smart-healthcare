package com.healthcare.backend.service;

import com.healthcare.backend.entity.Notification;
import com.healthcare.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // ===== CREATE NOTIFICATIONS =====

    public Notification createNotification(String recipientEmail, String type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setRecipientEmail(recipientEmail);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public Notification createAppointmentConfirmation(String email, String patientName, String doctorName, String date, String time, Long appointmentId) {
        String title = "Appointment Confirmed";
        String message = String.format("Your appointment with Dr. %s on %s at %s has been confirmed.", doctorName, date, time);
        String link = "/appointment/" + appointmentId;
        return createNotification(email, "APPOINTMENT_CONFIRMATION", title, message, link);
    }

    public Notification createAppointmentReminder(String email, String patientName, String doctorName, String date, String time, Long appointmentId) {
        String title = "Appointment Reminder";
        String message = String.format("Reminder: You have an appointment with Dr. %s tomorrow at %s.", doctorName, time);
        String link = "/appointment/" + appointmentId;
        return createNotification(email, "APPOINTMENT_REMINDER", title, message, link);
    }

    public Notification createAppointmentCancellation(String email, String patientName, String doctorName, String date, Long appointmentId) {
        String title = "Appointment Cancelled";
        String message = String.format("Your appointment with Dr. %s on %s has been cancelled.", doctorName, date);
        String link = "/appointment/" + appointmentId;
        return createNotification(email, "APPOINTMENT_CANCELLATION", title, message, link);
    }

    public Notification createReportNotification(String email, String patientName, String doctorName, String reportTitle, Long reportId) {
        String title = "Medical Report Uploaded";
        String message = String.format("Dr. %s has uploaded a new medical report for you: %s", doctorName, reportTitle);
        String link = "/my-reports";
        return createNotification(email, "REPORT_UPLOADED", title, message, link);
    }

    public Notification createPaymentConfirmation(String email, String patientName, Double amount, String invoiceNumber, Long billId) {
        String title = "Payment Confirmed";
        String message = String.format("Payment of ₹%.2f for invoice %s has been confirmed.", amount, invoiceNumber);
        String link = "/my-bills";
        return createNotification(email, "PAYMENT_CONFIRMATION", title, message, link);
    }

    public Notification createLowStockAlert(String email, String medicineName, Integer quantity) {
        String title = "Low Stock Alert";
        String message = String.format("Medicine '%s' is running low. Current stock: %d. Please reorder.", medicineName, quantity);
        String link = "/low-stock";
        return createNotification(email, "LOW_STOCK_ALERT", title, message, link);
    }

    public Notification createAnnouncement(String email, String title, String message) {
        return createNotification(email, "ANNOUNCEMENT", title, message, null);
    }

    // ===== GET NOTIFICATIONS =====

    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public List<Notification> getUnreadNotifications(String email) {
        return notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    // ===== MARK AS READ =====

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(email);
        unread.forEach(n -> {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unread);
    }

    // ===== DELETE =====

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void deleteAllForUser(String email) {
        notificationRepository.deleteAll(
            notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email)
        );
    }
}