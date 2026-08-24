package com.healthcare.backend.controller;

import com.healthcare.backend.dto.LoginRequest;
import com.healthcare.backend.entity.OTP;
import com.healthcare.backend.entity.Role;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.repository.UserRepository;
import com.healthcare.backend.security.JwtService;
import com.healthcare.backend.service.OTPService;
import com.healthcare.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final OTPService otpService;

    public AuthController(UserService userService,
                          UserRepository userRepository,
                          JwtService jwtService,
                          OTPService otpService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                user.setRole(Role.PATIENT);
            }
            
            user.setVerified(false);
            User savedUser = userService.saveUser(user);
            
            OTP otp = otpService.createOTP(user.getEmail(), "REGISTRATION");
            System.out.println("📧 OTP for " + user.getEmail() + ": " + otp.getOtp());
            
            return new ResponseEntity<>(Map.of(
                "message", "User registered successfully. Please verify OTP.",
                "email", user.getEmail(),
                "userId", savedUser.getId()
            ), HttpStatus.CREATED);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTPAndActivate(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otp");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        
        if (otpCode == null || otpCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP is required"));
        }
        
        try {
            boolean isValid = otpService.verifyOTP(email, otpCode, "REGISTRATION");
            
            if (!isValid) {
                return ResponseEntity.badRequest().body(Map.of(
                    "verified", false,
                    "error", "Invalid or expired OTP"
                ));
            }
            
            User user = userService.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            user.setVerified(true);
            userService.updateUser(user);
            
            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "OTP verified successfully! User activated."
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String purpose = request.getOrDefault("purpose", "REGISTRATION");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        
        try {
            OTP otp = otpService.resendOTP(email, purpose);
            System.out.println("📧 Resend OTP for " + email + ": " + otp.getOtp());
            
            return ResponseEntity.ok(Map.of(
                "message", "OTP resent successfully",
                "email", email,
                "expiryMinutes", 5
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== OTP LOGIN =====
    @PostMapping("/otp-login")
    public ResponseEntity<?> otpLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otp");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (otpCode == null || otpCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP is required"));
        }
        
        try {
            // ✅ Verify OTP with purpose "LOGIN"
            boolean isValid = otpService.verifyOTP(email, otpCode, "LOGIN");
            
            if (!isValid) {
                return ResponseEntity.badRequest().body(Map.of(
                    "verified", false,
                    "error", "Invalid or expired OTP"
                ));
            }
            
            // ✅ Get user and activate if not already verified
            User user = userService.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            if (!user.getVerified()) {
                user.setVerified(true);
                userService.updateUser(user);
            }
            
            // ✅ Generate JWT token with email and role
            String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name(),
                "message", "OTP login successful"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ===== PASSWORD LOGIN =====
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid email or password"));
            }

            if (!userService.checkPassword(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid email or password"));
            }

            // ✅ Generate JWT token with email and role
            String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
}