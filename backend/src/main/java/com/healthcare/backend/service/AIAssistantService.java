package com.healthcare.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIAssistantService {

    // ===== FAQ DATABASE =====
    private static final Map<String, String> FAQ_MAP = new HashMap<>();

    static {
        FAQ_MAP.put("how to book appointment", "To book an appointment, go to 'Book Appointment' from the dashboard, select a doctor, choose date and time, and click 'Book Appointment'.");
        FAQ_MAP.put("how to cancel appointment", "To cancel an appointment, go to 'My Appointments', find the appointment, and click 'Cancel'.");
        FAQ_MAP.put("how to view reports", "To view your medical reports, go to 'My Reports' from the dashboard. All your uploaded reports will be listed there.");
        FAQ_MAP.put("how to pay bill", "To pay a bill, go to 'My Bills', find the pending bill, and click 'Pay Now'. You can also view payment history there.");
        FAQ_MAP.put("how to contact doctor", "You can contact your doctor through the appointment details page, or book a new appointment to consult with them.");
        FAQ_MAP.put("what is otp", "OTP (One-Time Password) is a security code sent to your registered email for verification during login, registration, or password reset.");
        FAQ_MAP.put("forgot password", "If you forgot your password, you can use the 'Forgot Password' option on the login page. You'll receive an OTP to reset your password.");
        FAQ_MAP.put("hospital timings", "Our hospital is open 24/7. OPD timings are 9:00 AM to 5:00 PM. Emergency services are available 24 hours.");
        FAQ_MAP.put("emergency contact", "For emergencies, please call our emergency helpline: +91-9999999999 or visit the emergency department immediately.");
        FAQ_MAP.put("how to add prescription", "Doctors can add prescriptions from the 'Add Prescription' page. Select a patient, enter medicine details, and save.");
        FAQ_MAP.put("how to upload report", "Doctors can upload reports from the 'Add Report' page. Select a patient, enter report details, and upload the file.");
        FAQ_MAP.put("what is ai symptom checker", "AI Symptom Checker is a tool that analyzes your symptoms and suggests possible conditions and recommended specialists. It's for educational purposes only.");
        FAQ_MAP.put("how to view lab tests", "Patients can view their lab tests from 'My Lab Tests'. Doctors can view tests from 'My Lab Tests' under their dashboard.");
        FAQ_MAP.put("how to request medicine", "Doctors can request medicines from the 'Request Medicine' page. Admin will review and approve the request.");
        FAQ_MAP.put("how to admit patient", "Doctors or Admin can admit patients from the 'Admit Patient' page. Select a patient, choose a bed, and confirm admission.");
        FAQ_MAP.put("how to discharge patient", "To discharge a patient, go to 'Admissions', find the admitted patient, and click 'Discharge'. The bed will become available.");
    }

    // ===== PROCESS QUERY =====
    public Map<String, Object> processQuery(String query) {
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("error", "Please enter a question.");
            response.put("disclaimer", "This is an AI assistant. For medical emergencies, please contact a doctor immediately.");
            return response;
        }

        String lowerQuery = query.toLowerCase().trim();
        
        // Check FAQ
        String answer = null;
        for (Map.Entry<String, String> entry : FAQ_MAP.entrySet()) {
            if (lowerQuery.contains(entry.getKey()) || entry.getKey().contains(lowerQuery)) {
                answer = entry.getValue();
                break;
            }
        }

        if (answer != null) {
            response.put("answer", answer);
            response.put("type", "faq");
        } else {
            // Default response
            response.put("answer", "I'm not sure about that. Please try rephrasing your question, or contact hospital staff for assistance.");
            response.put("type", "general");
        }

        // Always add disclaimer
        response.put("disclaimer", "⚠️ This is an AI assistant for general guidance only. For medical emergencies, please contact a doctor immediately.");
        
        return response;
    }

    // ===== GET SUGGESTED QUESTIONS =====
    public String[] getSuggestedQuestions() {
        return new String[]{
            "How to book appointment?",
            "How to cancel appointment?",
            "How to view reports?",
            "How to pay bill?",
            "Forgot password",
            "Hospital timings",
            "Emergency contact",
            "How to upload report?"
        };
    }
}