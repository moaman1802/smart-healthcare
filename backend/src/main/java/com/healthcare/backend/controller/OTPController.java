package com.healthcare.backend.controller;

import com.healthcare.backend.entity.OTP;
import com.healthcare.backend.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "http://localhost:5173")
public class OTPController {

    @Autowired
    private OTPService otpService;

    // Generate and send OTP
    @PostMapping("/generate")
    public ResponseEntity<?> generateOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String purpose = request.get("purpose");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (purpose == null || purpose.trim().isEmpty()) {
            purpose = "REGISTRATION";
        }

        try {
            OTP otp = otpService.createOTP(email, purpose);
            // In real implementation, send email here
            System.out.println("📧 OTP for " + email + ": " + otp.getOtp());
            return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully",
                "email", email,
                "purpose", purpose,
                "expiryMinutes", 5
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Verify OTP
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otp");
        String purpose = request.get("purpose");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (otpCode == null || otpCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP is required"));
        }

        if (purpose == null || purpose.trim().isEmpty()) {
            purpose = "REGISTRATION";
        }

        boolean isValid = otpService.verifyOTP(email, otpCode, purpose);

        if (isValid) {
            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "OTP verified successfully"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "verified", false,
                "error", "Invalid or expired OTP"
            ));
        }
    }

    // Resend OTP
    @PostMapping("/resend")
    public ResponseEntity<?> resendOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String purpose = request.get("purpose");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (purpose == null || purpose.trim().isEmpty()) {
            purpose = "REGISTRATION";
        }

        try {
            OTP otp = otpService.resendOTP(email, purpose);
            System.out.println("📧 Resend OTP for " + email + ": " + otp.getOtp());
            return ResponseEntity.ok(Map.of(
                "message", "OTP resent successfully",
                "email", email,
                "purpose", purpose,
                "expiryMinutes", 5
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}